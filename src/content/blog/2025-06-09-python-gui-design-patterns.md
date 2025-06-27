---
title: "PythonでGUIアプリを作る時に絶対知っておくべき5つの設計パターン"
date: 2024-12-10
categories: ["技術解説"]
tags: ["Python", "GUI", "設計パターン", "Tkinter", "PyQt", "アーキテクチャ", "保守性"]
description: "建築会社向けアプリ開発の実体験から学んだ、Pythonデスクトップアプリの設計パターン。保守性と拡張性を両立させる実践的手法を解説"
---

## はじめに

「Pythonでデスクトップアプリを作ったけど、コードがスパゲッティ状態になってしまった」「機能追加のたびにバグが発生する」──このような悩みを抱えていませんか？

本記事では、HabitEngineerが某建築会社様向けに開発したPythonアプリケーションの実体験を基に、**保守性と拡張性を両立**させるための5つの設計パターンを解説します。3ヶ月間の開発プロジェクトで学んだ実践的なノウハウをお伝えします。

## 開発プロジェクトの概要

### プロジェクト背景
- **クライアント**: 某建築会社様
- **開発期間**: 3ヶ月
- **アプリ目的**: 業務特有の計算処理自動化
- **技術スタック**: Python 3.11 + Tkinter + SQLite

### 直面した課題
- **複雑な業務ロジック**: 建築特有の計算式
- **頻繁な仕様変更**: 法規制・業界基準の変化
- **非エンジニアユーザー**: 直感的なUI必須
- **長期保守**: 5年以上の継続利用予定

## 設計パターン1: MVCアーキテクチャの実装

### なぜMVCが重要なのか

GUI開発でよくある失敗は、**ビジネスロジックとUI処理の混在**です。建築会社プロジェクトでも、初期は以下のような問題が発生しました：

```python
# ❌ 悪い例：UIとロジックが混在
class CalculatorWindow:
    def __init__(self):
        self.window = tk.Tk()
        self.entry = tk.Entry(self.window)
        self.button = tk.Button(self.window, command=self.calculate)
    
    def calculate(self):
        # UIの値取得とビジネスロジックが混在
        length = float(self.entry.get())
        width = float(self.width_entry.get())
        
        # 複雑な建築計算ロジック
        area = length * width
        material_cost = area * 15000  # 材料費計算
        labor_cost = area * 8000     # 人件費計算
        
        # またUIの更新
        self.result_label.config(text=f"総額: {material_cost + labor_cost}円")
```

### MVCによる改善実装

#### Model: ビジネスロジック層
```python
# ✅ 良い例：ビジネスロジックの分離
from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class ConstructionProject:
    length: float
    width: float
    material_unit_cost: float = 15000
    labor_unit_cost: float = 8000
    
    def calculate_area(self) -> float:
        return self.length * self.width
    
    def calculate_material_cost(self) -> float:
        return self.calculate_area() * self.material_unit_cost
    
    def calculate_labor_cost(self) -> float:
        return self.calculate_area() * self.labor_unit_cost
    
    def calculate_total_cost(self) -> float:
        return self.calculate_material_cost() + self.calculate_labor_cost()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'area': self.calculate_area(),
            'material_cost': self.calculate_material_cost(),
            'labor_cost': self.calculate_labor_cost(),
            'total_cost': self.calculate_total_cost()
        }
```

#### View: UI表示層
```python
import tkinter as tk
from tkinter import ttk
from typing import Callable, Dict, Any

class CalculatorView:
    def __init__(self, parent: tk.Tk):
        self.parent = parent
        self.setup_ui()
        
        # コールバック関数（Controllerから設定）
        self.on_calculate: Callable = None
        
    def setup_ui(self):
        # レイアウト構築
        main_frame = ttk.Frame(self.parent, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 入力フィールド
        ttk.Label(main_frame, text="長さ (m):").grid(row=0, column=0, sticky=tk.W)
        self.length_var = tk.StringVar()
        self.length_entry = ttk.Entry(main_frame, textvariable=self.length_var)
        self.length_entry.grid(row=0, column=1, sticky=(tk.W, tk.E))
        
        ttk.Label(main_frame, text="幅 (m):").grid(row=1, column=0, sticky=tk.W)
        self.width_var = tk.StringVar()
        self.width_entry = ttk.Entry(main_frame, textvariable=self.width_var)
        self.width_entry.grid(row=1, column=1, sticky=(tk.W, tk.E))
        
        # 計算ボタン
        self.calc_button = ttk.Button(
            main_frame, 
            text="計算実行", 
            command=self._on_calculate_clicked
        )
        self.calc_button.grid(row=2, column=0, columnspan=2, pady=10)
        
        # 結果表示
        self.result_frame = ttk.LabelFrame(main_frame, text="計算結果", padding="5")
        self.result_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=10)
        
        self.result_labels = {}
        for i, label in enumerate(['面積', '材料費', '人件費', '総額']):
            ttk.Label(self.result_frame, text=f"{label}:").grid(row=i, column=0, sticky=tk.W)
            self.result_labels[label] = ttk.Label(self.result_frame, text="--")
            self.result_labels[label].grid(row=i, column=1, sticky=tk.W)
    
    def _on_calculate_clicked(self):
        if self.on_calculate:
            self.on_calculate()
    
    def get_input_data(self) -> Dict[str, str]:
        return {
            'length': self.length_var.get(),
            'width': self.width_var.get()
        }
    
    def update_results(self, results: Dict[str, Any]):
        self.result_labels['面積'].config(text=f"{results['area']:.2f} m²")
        self.result_labels['材料費'].config(text=f"¥{results['material_cost']:,.0f}")
        self.result_labels['人件費'].config(text=f"¥{results['labor_cost']:,.0f}")
        self.result_labels['総額'].config(text=f"¥{results['total_cost']:,.0f}")
    
    def show_error(self, message: str):
        tk.messagebox.showerror("エラー", message)
```

#### Controller: 制御層
```python
class CalculatorController:
    def __init__(self, view: CalculatorView):
        self.view = view
        self.view.on_calculate = self.handle_calculate
    
    def handle_calculate(self):
        try:
            # Viewから入力データ取得
            input_data = self.view.get_input_data()
            
            # 入力値検証
            length = self._validate_float(input_data['length'], "長さ")
            width = self._validate_float(input_data['width'], "幅")
            
            # Modelで計算実行
            project = ConstructionProject(length=length, width=width)
            results = project.to_dict()
            
            # Viewに結果表示
            self.view.update_results(results)
            
        except ValueError as e:
            self.view.show_error(str(e))
        except Exception as e:
            self.view.show_error(f"予期しないエラー: {e}")
    
    def _validate_float(self, value: str, field_name: str) -> float:
        if not value.strip():
            raise ValueError(f"{field_name}を入力してください")
        try:
            num = float(value)
            if num <= 0:
                raise ValueError(f"{field_name}は正の値を入力してください")
            return num
        except ValueError:
            raise ValueError(f"{field_name}は有効な数値を入力してください")
```

### MVCの利点

1. **テストしやすさ**: Modelは独立してテスト可能
2. **保守性**: 各層の責任が明確で修正しやすい
3. **再利用性**: ModelはCLIやAPIでも使用可能
4. **チーム開発**: UIとロジックを分担開発可能

## 設計パターン2: 設定管理の外部化

### 問題: ハードコーディングの罠

建築会社アプリでは、法規制や材料価格の変動により、定数の変更が頻繁に発生しました：

```python
# ❌ 悪い例：ハードコーディング
class ConstructionCalculator:
    def calculate_cost(self, area):
        MATERIAL_COST = 15000  # 法改正で変更されることが多い
        LABOR_COST = 8000      # 人件費も変動
        TAX_RATE = 0.10        # 消費税率も変更される
        
        return area * (MATERIAL_COST + LABOR_COST) * (1 + TAX_RATE)
```

### 解決策: 設定ファイルによる管理

#### config.json による設定外部化
```json
{
  "calculation": {
    "material_unit_cost": 15000,
    "labor_unit_cost": 8000,
    "tax_rate": 0.10,
    "overhead_rate": 0.15
  },
  "ui": {
    "window_width": 800,
    "window_height": 600,
    "theme": "clam"
  },
  "validation": {
    "max_length": 1000,
    "max_width": 1000,
    "min_value": 0.01
  }
}
```

#### 設定管理クラスの実装
```python
import json
from pathlib import Path
from typing import Any, Dict
from dataclasses import dataclass

@dataclass
class CalculationConfig:
    material_unit_cost: float
    labor_unit_cost: float
    tax_rate: float
    overhead_rate: float

@dataclass
class UIConfig:
    window_width: int
    window_height: int
    theme: str

@dataclass
class ValidationConfig:
    max_length: float
    max_width: float
    min_value: float

class ConfigManager:
    def __init__(self, config_path: str = "config.json"):
        self.config_path = Path(config_path)
        self._load_config()
    
    def _load_config(self):
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.calculation = CalculationConfig(**data['calculation'])
            self.ui = UIConfig(**data['ui'])
            self.validation = ValidationConfig(**data['validation'])
            
        except FileNotFoundError:
            self._create_default_config()
        except (json.JSONDecodeError, KeyError) as e:
            raise ValueError(f"設定ファイルが無効です: {e}")
    
    def _create_default_config(self):
        """デフォルト設定ファイルを作成"""
        default_config = {
            "calculation": {
                "material_unit_cost": 15000,
                "labor_unit_cost": 8000,
                "tax_rate": 0.10,
                "overhead_rate": 0.15
            },
            "ui": {
                "window_width": 800,
                "window_height": 600,
                "theme": "clam"
            },
            "validation": {
                "max_length": 1000,
                "max_width": 1000,
                "min_value": 0.01
            }
        }
        
        with open(self.config_path, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, indent=2, ensure_ascii=False)
        
        self._load_config()
    
    def save_config(self):
        """現在の設定をファイルに保存"""
        data = {
            "calculation": {
                "material_unit_cost": self.calculation.material_unit_cost,
                "labor_unit_cost": self.calculation.labor_unit_cost,
                "tax_rate": self.calculation.tax_rate,
                "overhead_rate": self.calculation.overhead_rate
            },
            "ui": {
                "window_width": self.ui.window_width,
                "window_height": self.ui.window_height,
                "theme": self.ui.theme
            },
            "validation": {
                "max_length": self.validation.max_length,
                "max_width": self.validation.max_width,
                "min_value": self.validation.min_value
            }
        }
        
        with open(self.config_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

# シングルトンパターンで設定管理
config = ConfigManager()
```

#### 設定を使った改善されたModel
```python
class ConstructionProject:
    def __init__(self, length: float, width: float):
        self.length = length
        self.width = width
        # 設定から値を取得
        self.config = config.calculation
    
    def calculate_total_cost(self) -> float:
        area = self.length * self.width
        base_cost = area * (self.config.material_unit_cost + self.config.labor_unit_cost)
        with_overhead = base_cost * (1 + self.config.overhead_rate)
        return with_overhead * (1 + self.config.tax_rate)
```

## 設計パターン3: エラーハンドリングの体系化

### 問題: 不適切なエラー処理

```python
# ❌ 悪い例：エラー情報が不十分
def calculate(self):
    try:
        result = some_calculation()
        self.display_result(result)
    except:
        messagebox.showerror("エラー", "計算に失敗しました")
```

### 解決策: カスタム例外クラスの活用

#### カスタム例外の定義
```python
class CalculationError(Exception):
    """計算関連のエラー基底クラス"""
    pass

class ValidationError(CalculationError):
    """入力値検証エラー"""
    def __init__(self, field_name: str, value: Any, message: str):
        self.field_name = field_name
        self.value = value
        self.message = message
        super().__init__(f"{field_name}: {message}")

class BusinessLogicError(CalculationError):
    """ビジネスロジックエラー"""
    def __init__(self, operation: str, reason: str):
        self.operation = operation
        self.reason = reason
        super().__init__(f"{operation}の実行に失敗: {reason}")

class ConfigurationError(CalculationError):
    """設定関連エラー"""
    pass
```

#### バリデーターの実装
```python
from typing import Union

class InputValidator:
    def __init__(self, config: ValidationConfig):
        self.config = config
    
    def validate_dimension(self, value: str, field_name: str) -> float:
        # 空値チェック
        if not value.strip():
            raise ValidationError(field_name, value, "値が入力されていません")
        
        # 数値変換チェック
        try:
            num_value = float(value)
        except ValueError:
            raise ValidationError(field_name, value, "有効な数値を入力してください")
        
        # 範囲チェック
        if num_value < self.config.min_value:
            raise ValidationError(
                field_name, 
                num_value, 
                f"{self.config.min_value}以上の値を入力してください"
            )
        
        if field_name == "長さ" and num_value > self.config.max_length:
            raise ValidationError(
                field_name, 
                num_value, 
                f"{self.config.max_length}以下の値を入力してください"
            )
        
        if field_name == "幅" and num_value > self.config.max_width:
            raise ValidationError(
                field_name, 
                num_value, 
                f"{self.config.max_width}以下の値を入力してください"
            )
        
        return num_value
    
    def validate_project_data(self, length: float, width: float) -> None:
        # ビジネスルール検証
        area = length * width
        if area > 10000:  # 1万平米超
            raise BusinessLogicError(
                "面積計算", 
                "計算可能な最大面積（10,000m²）を超えています"
            )
```

#### 統一されたエラーハンドリング
```python
import logging
from datetime import datetime

class ErrorHandler:
    def __init__(self, view):
        self.view = view
        self.setup_logging()
    
    def setup_logging(self):
        logging.basicConfig(
            filename=f'app_errors_{datetime.now().strftime("%Y%m")}.log',
            level=logging.ERROR,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
    
    def handle_error(self, error: Exception, context: str = ""):
        """統一されたエラー処理"""
        if isinstance(error, ValidationError):
            self._handle_validation_error(error)
        elif isinstance(error, BusinessLogicError):
            self._handle_business_error(error)
        elif isinstance(error, ConfigurationError):
            self._handle_config_error(error)
        else:
            self._handle_unexpected_error(error, context)
    
    def _handle_validation_error(self, error: ValidationError):
        message = f"入力エラー\n\n{error.message}\n\n入力値を確認してください。"
        self.view.show_error(message)
    
    def _handle_business_error(self, error: BusinessLogicError):
        message = f"計算エラー\n\n{error.reason}\n\n条件を変更して再実行してください。"
        self.view.show_error(message)
    
    def _handle_config_error(self, error: ConfigurationError):
        message = f"設定エラー\n\n{str(error)}\n\n設定ファイルを確認してください。"
        self.view.show_error(message)
    
    def _handle_unexpected_error(self, error: Exception, context: str):
        error_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # ログに詳細を記録
        logging.error(f"Unexpected error [{error_id}] in {context}: {str(error)}")
        
        # ユーザーには簡潔なメッセージ
        message = f"予期しないエラーが発生しました\n\nエラーID: {error_id}\n\nサポートにお問い合わせください。"
        self.view.show_error(message)
```

## 設計パターン4: データ永続化の抽象化

### 問題: データアクセスの散在

```python
# ❌ 悪い例：SQLが散在
class ProjectManager:
    def save_project(self, project):
        conn = sqlite3.connect('projects.db')
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO projects (name, length, width, cost) VALUES (?, ?, ?, ?)",
            (project.name, project.length, project.width, project.cost)
        )
        conn.commit()
        conn.close()
```

### 解決策: Repository パターン

#### データモデルの定義
```python
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class ProjectData:
    id: Optional[int]
    name: str
    length: float
    width: float
    material_cost: float
    labor_cost: float
    total_cost: float
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'length': self.length,
            'width': self.width,
            'material_cost': self.material_cost,
            'labor_cost': self.labor_cost,
            'total_cost': self.total_cost,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
```

#### Repository の実装
```python
import sqlite3
from typing import List, Optional
from abc import ABC, abstractmethod

class ProjectRepository(ABC):
    @abstractmethod
    def save(self, project: ProjectData) -> int:
        pass
    
    @abstractmethod
    def find_by_id(self, project_id: int) -> Optional[ProjectData]:
        pass
    
    @abstractmethod
    def find_all(self) -> List[ProjectData]:
        pass
    
    @abstractmethod
    def update(self, project: ProjectData) -> bool:
        pass
    
    @abstractmethod
    def delete(self, project_id: int) -> bool:
        pass

class SQLiteProjectRepository(ProjectRepository):
    def __init__(self, db_path: str = "projects.db"):
        self.db_path = db_path
        self._initialize_db()
    
    def _initialize_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    length REAL NOT NULL,
                    width REAL NOT NULL,
                    material_cost REAL NOT NULL,
                    labor_cost REAL NOT NULL,
                    total_cost REAL NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
    
    def save(self, project: ProjectData) -> int:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO projects 
                (name, length, width, material_cost, labor_cost, total_cost, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                project.name, project.length, project.width,
                project.material_cost, project.labor_cost, project.total_cost,
                project.created_at.isoformat(), project.updated_at.isoformat()
            ))
            return cursor.lastrowid
    
    def find_by_id(self, project_id: int) -> Optional[ProjectData]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_project(row)
            return None
    
    def find_all(self) -> List[ProjectData]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM projects ORDER BY created_at DESC")
            rows = cursor.fetchall()
            
            return [self._row_to_project(row) for row in rows]
    
    def _row_to_project(self, row: sqlite3.Row) -> ProjectData:
        return ProjectData(
            id=row['id'],
            name=row['name'],
            length=row['length'],
            width=row['width'],
            material_cost=row['material_cost'],
            labor_cost=row['labor_cost'],
            total_cost=row['total_cost'],
            created_at=datetime.fromisoformat(row['created_at']),
            updated_at=datetime.fromisoformat(row['updated_at'])
        )
```

## 設計パターン5: テスト可能な設計

### テストしやすいアーキテクチャ

#### Modelのユニットテスト
```python
import unittest
from unittest.mock import patch, MagicMock

class TestConstructionProject(unittest.TestCase):
    def setUp(self):
        self.project = ConstructionProject(length=10.0, width=8.0)
    
    def test_calculate_area(self):
        expected = 80.0
        actual = self.project.calculate_area()
        self.assertEqual(actual, expected)
    
    def test_calculate_total_cost(self):
        # 設定値をモック
        with patch('config.calculation') as mock_config:
            mock_config.material_unit_cost = 15000
            mock_config.labor_unit_cost = 8000
            mock_config.overhead_rate = 0.15
            mock_config.tax_rate = 0.10
            
            # 期待値計算: 80 * (15000 + 8000) * 1.15 * 1.10
            expected = 80 * 23000 * 1.15 * 1.10
            actual = self.project.calculate_total_cost()
            self.assertAlmostEqual(actual, expected, places=2)

class TestInputValidator(unittest.TestCase):
    def setUp(self):
        mock_config = MagicMock()
        mock_config.min_value = 0.01
        mock_config.max_length = 1000
        mock_config.max_width = 1000
        self.validator = InputValidator(mock_config)
    
    def test_validate_dimension_valid_input(self):
        result = self.validator.validate_dimension("10.5", "長さ")
        self.assertEqual(result, 10.5)
    
    def test_validate_dimension_empty_input(self):
        with self.assertRaises(ValidationError) as cm:
            self.validator.validate_dimension("", "長さ")
        self.assertEqual(cm.exception.field_name, "長さ")
    
    def test_validate_dimension_invalid_number(self):
        with self.assertRaises(ValidationError):
            self.validator.validate_dimension("abc", "長さ")
    
    def test_validate_dimension_negative_value(self):
        with self.assertRaises(ValidationError):
            self.validator.validate_dimension("-5", "長さ")

if __name__ == '__main__':
    unittest.main()
```

#### 統合テストの例
```python
import tempfile
import os

class TestProjectRepository(unittest.TestCase):
    def setUp(self):
        # テスト用の一時データベース
        self.temp_db = tempfile.NamedTemporaryFile(delete=False)
        self.temp_db.close()
        self.repository = SQLiteProjectRepository(self.temp_db.name)
        
        # テストデータ
        self.test_project = ProjectData(
            id=None,
            name="テストプロジェクト",
            length=10.0,
            width=8.0,
            material_cost=1200000,
            labor_cost=640000,
            total_cost=2024000,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    
    def tearDown(self):
        os.unlink(self.temp_db.name)
    
    def test_save_and_find_project(self):
        # 保存
        project_id = self.repository.save(self.test_project)
        self.assertIsNotNone(project_id)
        
        # 検索
        found_project = self.repository.find_by_id(project_id)
        self.assertIsNotNone(found_project)
        self.assertEqual(found_project.name, "テストプロジェクト")
        self.assertEqual(found_project.length, 10.0)
```

## 実際の運用での学び

### 成功した施策

#### 1. 段階的なリファクタリング
- 最初はモノリシックな構造から開始
- 機能追加のタイミングでパターンを導入
- 一度に全てを変更せず、徐々に改善

#### 2. 設定ファイルによる柔軟性
- 税率変更時もコード修正不要
- クライアントが自身で設定変更可能
- テスト環境と本番環境の設定分離

#### 3. 包括的なエラーハンドリング
- ユーザーフレンドリーなエラーメッセージ
- 開発者向けの詳細ログ
- 予期しないエラーからの優雅な復旧

### 苦労したポイント

#### 1. 初期の設計不足
- MVP思考で始めたものの、設計を軽視
- 後のリファクタリングコストが高くなった
- 教訓：最小限でも設計パターンは最初から考慮

#### 2. ユーザビリティとの兼ね合い
- 技術的には美しい設計でも、UI複雑化のリスク
- エンジニア目線とユーザー目線のバランス
- 教訓：設計の複雑さをUIに押し付けない

## まとめ

PythonでGUIアプリケーションを開発する際の5つの設計パターンをご紹介しました：

### 5つのパターンの要点

1. **MVCアーキテクチャ**: ビジネスロジックとUIの明確な分離
2. **設定管理**: ハードコーディングを避け、外部設定ファイルを活用
3. **エラーハンドリング**: カスタム例外による体系的なエラー処理
4. **データ永続化**: Repository パターンによるデータアクセスの抽象化
5. **テスト可能性**: 各層を独立してテストできる設計

### 導入の優先順位

**Phase 1**: MVCアーキテクチャ + 基本的なエラーハンドリング
**Phase 2**: 設定管理の外部化
**Phase 3**: Repository パターンの導入
**Phase 4**: 包括的なテストスイート構築

### 最後に

設計パターンは目的ではなく手段です。**保守性**、**拡張性**、**テスト可能性**を向上させるための道具として、プロジェクトの規模と要件に応じて適切に選択・適用することが重要です。

建築会社様のプロジェクトでは、これらのパターンにより3ヶ月の開発期間中に仕様変更に柔軟に対応でき、5年以上の長期保守を見据えた安定したアプリケーションを提供できました。

---

**Python開発支援のご相談:**
- お問い合わせ: [dev@habitengineer.com](mailto:dev@habitengineer.com)
- 技術支援: アーキテクチャ設計から実装・保守まで包括的にサポート
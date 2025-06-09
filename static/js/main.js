document.addEventListener('DOMContentLoaded', function() {
    // フォーム送信成功メッセージ
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL params:', window.location.search);
    console.log('Success param:', urlParams.get('success'));
    
    if (urlParams.get('success') === 'true') {
        const form = document.querySelector('.contact-form');
        console.log('Form found:', form);
        if (form) {
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerHTML = '<p>お問い合わせありがとうございます。<br>内容を確認次第、ご連絡させていただきます。</p>';
            successMessage.style.cssText = 'background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: center; border: 1px solid #c3e6cb;';
            form.parentNode.insertBefore(successMessage, form);
            form.style.display = 'none';
            
            // URLからパラメータを削除
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    // メールアドレスコピー機能
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.href.replace('mailto:', '');
            navigator.clipboard.writeText(email);
            
            // 簡単な通知
            const notification = document.createElement('div');
            notification.textContent = 'コピーしました';
            notification.className = 'copy-notification';
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 2000);
        });
    });

    // ハンバーガーメニュー機能
    const hamburgerButton = document.querySelector('.hamburger-button');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (hamburgerButton && sidebar && mobileOverlay) {
        function toggleMenu() {
            hamburgerButton.classList.toggle('active');
            sidebar.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            
            // body のスクロールを制御
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        function closeMenu() {
            hamburgerButton.classList.remove('active');
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // ハンバーガーボタンクリック
        hamburgerButton.addEventListener('click', toggleMenu);

        // オーバーレイクリックでメニューを閉じる
        mobileOverlay.addEventListener('click', closeMenu);

        // メニューリンククリックでメニューを閉じる
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // ESCキーでメニューを閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeMenu();
            }
        });

        // ウィンドウリサイズ時にモバイルメニューを閉じる
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
                closeMenu();
            }
        });
    }
});
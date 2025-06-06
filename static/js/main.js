document.addEventListener('DOMContentLoaded', function() {
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
});
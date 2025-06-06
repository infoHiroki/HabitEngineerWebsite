// Main JavaScript for HabitEngineer website

document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navigation = document.querySelector('.main-navigation');
  
  if (mobileMenuToggle && navigation) {
    mobileMenuToggle.addEventListener('click', function() {
      navigation.classList.toggle('is-active');
      this.classList.toggle('is-active');
    });
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Submenu toggle for mobile
  const hasSubmenu = document.querySelectorAll('.has-submenu');
  hasSubmenu.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('is-open');
        }
      });
    }
  });

  // Header scroll effect
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    
    lastScroll = currentScroll;
  });
});
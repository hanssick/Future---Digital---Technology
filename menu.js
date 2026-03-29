/* ===============================================
   ETAPA 3 - JavaScript pentru Meniu
   Funcționalitate Hamburger & Submeniu Mobil
   =============================================== */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // HAMBURGER MENU TOGGLE
    // ============================================
    
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', function() {
            // Toggle active class
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria-expanded pentru accesibilitate
            const isExpanded = burgerMenu.classList.contains('active');
            burgerMenu.setAttribute('aria-expanded', isExpanded);
            
            // Previne scroll când meniul e deschis pe mobil
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    
    // ============================================
    // SUBMENU TOGGLE PE MOBIL
    // ============================================
    
    const menuItems = document.querySelectorAll('.nav-menu > li');
    
    menuItems.forEach(item => {
        const submenu = item.querySelector('ul');
        
        // Doar pentru itemele cu submeniu
        if (submenu) {
            const link = item.querySelector('> a');
            
            // Click pe link când e mobil
            link.addEventListener('click', function(e) {
                // Verifică dacă e mobil (hamburger vizibil)
                const isMobile = window.getComputedStyle(burgerMenu).display !== 'none';
                
                if (isMobile) {
                    // Previne navigarea
                    e.preventDefault();
                    
                    // Toggle submeniu
                    item.classList.toggle('submenu-open');
                }
            });
        }
    });
    
    
    // ============================================
    // ÎNCHIDE MENIU LA CLICK PE LINK (MOBIL)
    // ============================================
    
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Verifică dacă e link către secțiune (nu către altă pagină)
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                // Verifică dacă e mobil
                const isMobile = window.getComputedStyle(burgerMenu).display !== 'none';
                
                if (isMobile && !link.parentElement.querySelector('ul')) {
                    // Închide meniul
                    burgerMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    
    // ============================================
    // RESIZE HANDLER - RESETARE LA DESKTOP
    // ============================================
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce pentru performance
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            
            const isMobile = window.getComputedStyle(burgerMenu).display !== 'none';
            
            // Dacă trecem la desktop, resetăm meniul
            if (!isMobile) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Închide toate submeniurile
                menuItems.forEach(item => {
                    item.classList.remove('submenu-open');
                });
            }
        }, 250);
    });
    
    
    // ============================================
    // ACTIVE LINK HIGHLIGHTING
    // ============================================
    
    // Marchează linkul activ bazat pe scroll position
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Găsește linkul corespunzător
                const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                
                // Elimină clasa active de la toate linkurile
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Adaugă clasa active la linkul curent
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Scroll event cu throttle pentru performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                updateActiveLink();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // Apelează la încărcare
    updateActiveLink();
    
    
    // ============================================
    // SMOOTH SCROLL PENTRU LINKURI INTERNE
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore dacă e doar "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Offset pentru meniu sticky
                const menuHeight = document.querySelector('.main-navigation').offsetHeight;
                const targetPosition = target.offsetTop - menuHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ============================================
    // ACCESSIBILITY - ESC KEY PENTRU ÎNCHIDERE
    // ============================================
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (burgerMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    
    // ============================================
    // PRINT PREPARATION
    // ============================================
    
    // Închide meniul înainte de printare
    window.addEventListener('beforeprint', function() {
        burgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
});


// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy loading pentru submeniuri
if ('IntersectionObserver' in window) {
    const submenuObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    });
    
    document.querySelectorAll('.nav-menu > li > ul').forEach(submenu => {
        submenuObserver.observe(submenu);
    });
}

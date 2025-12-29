// about.js - About Page Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Animate stats counter
    animateStats();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Add hover effects for cards
    initHoverEffects();
    
    // Smooth scrolling for footer links
    initSmoothScrolling();
});

// Animate stats counter
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace('+', ''));
        const suffix = stat.textContent.includes('+') ? '+' : '';
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
        }, 16);
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.mission-card, .feature-item, .team-card').forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .mission-card, .feature-item, .team-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .mission-card.animated, .feature-item.animated, .team-card.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mission-card.animated:nth-child(1) { transition-delay: 0.1s; }
        .mission-card.animated:nth-child(2) { transition-delay: 0.2s; }
        .mission-card.animated:nth-child(3) { transition-delay: 0.3s; }
        
        .feature-item.animated:nth-child(1) { transition-delay: 0.1s; }
        .feature-item.animated:nth-child(2) { transition-delay: 0.2s; }
        .feature-item.animated:nth-child(3) { transition-delay: 0.3s; }
        .feature-item.animated:nth-child(4) { transition-delay: 0.4s; }
        .feature-item.animated:nth-child(5) { transition-delay: 0.5s; }
        .feature-item.animated:nth-child(6) { transition-delay: 0.6s; }
        
        .team-card.animated:nth-child(1) { transition-delay: 0.1s; }
        .team-card.animated:nth-child(2) { transition-delay: 0.2s; }
        .team-card.animated:nth-child(3) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
}

// Initialize hover effects
function initHoverEffects() {
    const cards = document.querySelectorAll('.mission-card, .feature-item, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('touchstart', function() {
            this.classList.add('hover-effect');
        });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('hover-effect');
        });
    });
}

// Smooth scrolling for footer links
function initSmoothScrolling() {
    const footerLinks = document.querySelectorAll('.footer-section a[href^="#"], .footer-section a[href*=".html"]');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only smooth scroll for internal page links
            if (href.includes('.html')) {
                return; // Let browser handle page navigation
            }
            
            // For anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Add parallax effect to hero image
function initParallax() {
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Initialize on load
window.addEventListener('load', function() {
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.mission-card, .feature-item, .team-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
            }, index * 100);
        });
    }, 500);
    
    // Initialize parallax if hero image exists
    initParallax();
});

// Add loading animation for images
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    // Add loaded class if image is already loaded
    if (img.complete) {
        img.classList.add('loaded');
    }
});

// Add loading animation CSS
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    img {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .hover-effect {
        transform: translateY(-5px) !important;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important;
    }
`;
document.head.appendChild(loadingStyle);
// nav.js - Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('navList');
    const navigation = document.getElementById('nav');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
        navigation.classList.toggle('active');
        
        // Prevent scrolling when menu is open on mobile
        if (navList.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking on a link (for mobile)
    const navLinks = document.querySelectorAll('.navItem a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                navigation.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navList.contains(event.target) || hamburger.contains(event.target);
            
            if (!isClickInsideNav && navList.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                navigation.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // Close menu on window resize if resized to larger screen
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            navigation.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Helper function for throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Navbar transparency control
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section'); // Used to calculate scroll depth

    const handleNavbarScroll = () => {
        // Check if navbar exists
        if (!navbar) return;

        let scrollThreshold = 50; // Default threshold if no hero section
        if (heroSection) {
            scrollThreshold = heroSection.offsetHeight * 0.1;
        }
        
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('solid');
            navbar.classList.remove('transparent');
        } else {
            navbar.classList.remove('solid');
            navbar.classList.add('transparent');
        }
    };

    // Initial and throttled scroll check for navbar
    if (navbar) {
        handleNavbarScroll(); // Initial check
        window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
    }


    // Theme toggle (Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme === 'dark') {
            document.body.classList.add('dark');
            themeToggle.checked = true;
        } else if (currentTheme === 'light') {
            document.body.classList.remove('dark');
            themeToggle.checked = false;
        } else if (prefersDarkScheme.matches) { // No theme in localStorage, use system preference
            document.body.classList.add('dark');
            themeToggle.checked = true;
            // Optionally, save this preference: localStorage.setItem('theme', 'dark');
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Update ARIA attribute for accessibility
            const isActive = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            menuToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active'); // If you add 'active' class to button too
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // Back to Top button
    const backToTopButton = document.getElementById('back-to-top'); // Changed selector to ID

    if (backToTopButton) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        };

        toggleBackToTop(); // Initial check
        window.addEventListener('scroll', throttle(toggleBackToTop, 150));

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault(); // Good practice for buttons that trigger JS actions
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mouse trail animation
    const mouseTrail = document.querySelector('.mouse-trail'); // Select existing element
    if (mouseTrail) {
        let mouseX = 0;
        let mouseY = 0;
        let trailX = 0;
        let trailY = 0;
        let animationFrameId = null;
        const trailSpeed = 0.2; // Adjust for faster/slower trailing effect (0.1 is faster, 0.5 is slower)

        const updateTrailPosition = () => {
            // Lerp (linear interpolation) for smoother movement
            trailX += (mouseX - trailX) * trailSpeed;
            trailY += (mouseY - trailY) * trailSpeed;

            mouseTrail.style.left = `${trailX}px`;
            mouseTrail.style.top = `${trailY}px`;
            
            // Check if the trail is close enough to the mouse to stop the loop
            // to save resources when the mouse is idle.
            if (Math.abs(mouseX - trailX) > 0.5 || Math.abs(mouseY - trailY) > 0.5) {
                animationFrameId = requestAnimationFrame(updateTrailPosition);
            } else {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null; // Reset ID
            }
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            mouseTrail.style.opacity = '1'; // Make visible

            if (!animationFrameId) { // Start animation loop if not already running
                animationFrameId = requestAnimationFrame(updateTrailPosition);
            }
        });

        document.addEventListener('mouseleave', () => {
            mouseTrail.style.opacity = '0';
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        });
         document.addEventListener('mouseenter', () => {
            // Reset trail position to avoid jump if mouse re-enters quickly from a different spot
            // trailX = mouseX; 
            // trailY = mouseY;
            if (mouseX !== 0 || mouseY !== 0) { // Only if mouse has moved before
                 mouseTrail.style.opacity = '1';
                 if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(updateTrailPosition);
                 }
            }
        });
    }

    // Elements fade-in animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-element');
    if (fadeElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Portfolio Section scroll shaking effect (optional, can be performance heavy)
    const portfolioSection = document.querySelector('.portfolio-section');
    if (portfolioSection) {
        let shakeTimeout;
        const handlePortfolioShake = () => {
            // This will add 'shaking' to the entire portfolio section container.
            // If you want individual items to shake, the logic needs to be more complex.
            // For now, it affects the container. Consider if this is the desired effect.
            // The CSS for .shaking is currently commented out to prevent this.
            // If you enable it, this code will work.

            // clearTimeout(shakeTimeout);
            // portfolioSection.classList.add('shaking');
            // shakeTimeout = setTimeout(() => {
            //     portfolioSection.classList.remove('shaking');
            // }, 300); // Corresponds to animation duration
        };
        
        // Throttled call to the shake handler
        // portfolioSection.addEventListener('scroll', throttle(handlePortfolioShake, 200));
        // Note: Shaking a scrolling container can be disorienting. Test thoroughly.
        // I've kept the code but commented out the actual class manipulation and listener
        // because the CSS for .shaking was also commented out.
    }
});
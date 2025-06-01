// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // 导航栏透明度控制
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');

    const handleNavbarScroll = () => {
        if (heroSection) {
            const heroHeight = heroSection.offsetHeight;
            if (window.scrollY > heroHeight * 0.1) { // 当滚动超过 Hero Section 10%时
                navbar.classList.add('solid');
                navbar.classList.remove('transparent');
            } else {
                navbar.classList.remove('solid');
                navbar.classList.add('transparent');
            }
        } else { // 如果没有hero section，导航栏始终为solid
            navbar.classList.add('solid');
            navbar.classList.remove('transparent');
        }
    };

    // 初始加载时检查导航栏状态
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);

    // 主题切换功能 (暗黑模式)
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    // 初始设置主题
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        if (savedTheme === 'dark') {
            themeToggle.checked = true;
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 检查用户系统偏好设置
        document.body.classList.add('dark');
        themeToggle.checked = true;
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

    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // 点击菜单项后关闭菜单 (可选)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // 返回顶部按钮
    const backToTopButton = document.querySelector('.back-to-top');

    const toggleBackToTop = () => {
        if (window.scrollY > 300) { // 滚动超过300px显示按钮
            backToTopButton.style.display = 'flex'; // 使用flex以便于内容居中
        } else {
            backToTopButton.style.display = 'none';
        }
    };

    window.addEventListener('scroll', toggleBackToTop);
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 鼠标轨迹动画
    const mouseTrail = document.createElement('div');
    mouseTrail.classList.add('mouse-trail');
    document.body.appendChild(mouseTrail);

    document.addEventListener('mousemove', (e) => {
        mouseTrail.style.left = `${e.clientX}px`;
        mouseTrail.style.top = `${e.clientY}px`;
        mouseTrail.style.opacity = '1'; // 鼠标移动时确保可见
    });

    // 鼠标离开文档时隐藏轨迹
    document.addEventListener('mouseleave', () => {
        mouseTrail.style.opacity = '0';
    });

    // 元素淡入动画（Intersection Observer）
    const fadeElements = document.querySelectorAll('.fade-element');
    const observerOptions = {
        root: null, // 视口作为根
        rootMargin: '0px',
        threshold: 0.1 // 元素10%进入视口时触发
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一旦可见就不再观察
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 滚动抖动效果 (Portfolio Section)
    const portfolioSection = document.querySelector('.portfolio-section');
    if (portfolioSection) {
        let lastScrollLeft = portfolioSection.scrollLeft;
        let shakeTimeout;

        portfolioSection.addEventListener('scroll', () => {
            clearTimeout(shakeTimeout); // 清除上次的抖动
            portfolioSection.classList.add('shaking'); // 添加抖动类

            shakeTimeout = setTimeout(() => {
                portfolioSection.classList.remove('shaking'); // 移除抖动类
            }, 300); // 抖动动画持续时间

            lastScrollLeft = portfolioSection.scrollLeft;
        });
    }
});
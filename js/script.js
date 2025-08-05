// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    
    const loadComponent = async (selector, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
            const text = await response.text();
            const container = document.querySelector(selector);
            if (container) container.innerHTML = text;
        } catch (error) {
            console.error(`Error loading component into ${selector}:`, error);
        }
    };

    const loadSharedComponents = async () => {
        await loadComponent('#sidebar-container', 'components/sidebar.html');
        await loadComponent('#header-container', 'components/header.html');
        
        initializeTheme();
        updateActiveNavigation();
    };

    const updateLogoForTheme = (theme) => {
        const logo = document.getElementById('sidebar-logo');
        if (logo) {
            logo.src = theme === 'dark' ? 'placeholder-logo-dark.png' : 'placeholder-logo-light.png';
        }
    };

    const initializeTheme = () => {
        const themeToggleButton = document.getElementById('theme-toggle-button');
        if (!themeToggleButton) {
            console.error("Theme toggle button not found. Check if sidebar.html loaded correctly.");
            return;
        }

        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        document.body.setAttribute('data-theme', savedTheme);
        updateLogoForTheme(savedTheme);

        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            updateLogoForTheme(newTheme);
        });
    };

    const updateActiveNavigation = () => {
        const path = window.location.pathname;
        const pageName = path.split('/').pop().replace('.html', '') || 'index';
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });
    };

    loadSharedComponents();
});
// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- COMPONENT LOADING ---
    // This function fetches an HTML file and injects it into a specified container.
    const loadComponent = async (selector, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // If the file is not found, it's a 404 error.
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            const text = await response.text();
            const container = document.querySelector(selector);
            if (container) {
                container.innerHTML = text;
            } else {
                console.warn(`Container with selector "${selector}" not found.`);
            }
        } catch (error) {
            console.error(`Error loading component into ${selector}:`, error);
        }
    };

    // This function orchestrates the loading of all shared components.
    const loadSharedComponents = async () => {
        // Use the correct paths relative to index.html
        await loadComponent('#sidebar-container', 'components/sidebar.html');
        await loadComponent('#header-container', 'components/header.html');
        
        // IMPORTANT: These functions can only run *after* the components are loaded.
        initializeTheme();
        updateActiveNavigation();
    };

    // --- THEME MANAGEMENT ---
    const updateLogoForTheme = (theme) => {
        const logo = document.getElementById('sidebar-logo');
        if (logo) {
            // Make sure you have these two logo files in your root directory
            logo.src = theme === 'dark' ? 'placeholder-logo-dark.png' : 'placeholder-logo-light.png';
        }
    };

    const initializeTheme = () => {
        const themeToggleButton = document.getElementById('theme-toggle-button');
        if (!themeToggleButton) {
            // If the button isn't found, it means the sidebar hasn't loaded yet.
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

    // --- NAVIGATION ---
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

    // --- INITIALIZATION ---
    // This starts the entire process.
    loadSharedComponents();
});
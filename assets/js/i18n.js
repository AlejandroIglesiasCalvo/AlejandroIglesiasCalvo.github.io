// Language detection and switching functionality
(function() {
    'use strict';

    // Available languages
    const LANGUAGES = ['es', 'en'];
    const DEFAULT_LANG = 'es';
    
    // Get browser language
    function getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        const shortLang = lang.split('-')[0];
        return LANGUAGES.includes(shortLang) ? shortLang : DEFAULT_LANG;
    }
    
    // Get current language from URL or localStorage
    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        if (urlLang && LANGUAGES.includes(urlLang)) {
            localStorage.setItem('preferred-language', urlLang);
            return urlLang;
        }
        
        const storedLang = localStorage.getItem('preferred-language');
        if (storedLang && LANGUAGES.includes(storedLang)) {
            return storedLang;
        }
        
        return getBrowserLanguage();
    }
    
    // Set language and reload if necessary
    function setLanguage(lang) {
        if (!LANGUAGES.includes(lang)) {
            lang = DEFAULT_LANG;
        }
        
        localStorage.setItem('preferred-language', lang);
        
        const currentLang = getCurrentLanguage();
        if (currentLang !== lang) {
            const url = new URL(window.location);
            url.searchParams.set('lang', lang);
            window.location.href = url.toString();
        }
    }
    
    // Initialize language on page load
    function initLanguage() {
        const currentLang = getCurrentLanguage();
        document.documentElement.lang = currentLang;
        
        // Add language class to body for CSS styling if needed
        document.body.classList.add(`lang-${currentLang}`);
        
        // Update page content based on language
        updatePageContent(currentLang);
        
        // Add language switcher if it doesn't exist
        addLanguageSwitcher(currentLang);
    }
    
    // Update page content based on selected language
    function updatePageContent(lang) {
        // This will be handled by Jekyll templating, but we can add
        // any client-side updates here if needed
        
        // Update CV download link
        const cvLinks = document.querySelectorAll('[data-cv-link]');
        cvLinks.forEach(link => {
            if (lang === 'en') {
                link.href = link.href.replace('cv.pdf', 'cv-eng.pdf');
            } else {
                link.href = link.href.replace('cv-eng.pdf', 'cv.pdf');
            }
        });
    }
    
    // Add language switcher to the page
    function addLanguageSwitcher(currentLang) {
        const existingSwitcher = document.querySelector('.language-switcher');
        if (existingSwitcher) return;
        
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="lang-btn ${currentLang === 'es' ? 'active' : ''}" data-lang="es">ES</button>
            <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .language-switcher {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                gap: 5px;
            }
            .lang-btn {
                padding: 8px 12px;
                border: 2px solid var(--primary-color, #007bff);
                background: var(--bg-color, #fff);
                color: var(--text-color, #333);
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .lang-btn:hover {
                background: var(--primary-color, #007bff);
                color: white;
            }
            .lang-btn.active {
                background: var(--primary-color, #007bff);
                color: white;
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners
        switcher.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const selectedLang = e.target.dataset.lang;
                setLanguage(selectedLang);
            }
        });
        
        document.body.appendChild(switcher);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguage);
    } else {
        initLanguage();
    }
    
    // Expose functions globally if needed
    window.i18n = {
        setLanguage,
        getCurrentLanguage,
        getBrowserLanguage
    };
})();

/* Simple Accessibility Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved settings on load
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    if (localStorage.getItem('dyslexicFont') === 'true') {
        document.body.classList.add('dyslexic-font');
    }
    
    // Apply saved language direction (basic support)
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'ar') {
        document.documentElement.lang = 'ar';
        document.body.dir = 'rtl';
    }
});

/* Toggle the Panel Visibility */
function toggleA11yPanel() {
    const panel = document.getElementById('a11y-panel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

/* 1. Language Toggle */
function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    // Reload to apply server-side translations if available, 
    // or just to refresh the direction for this demo
    location.reload(); 
    document.body.classList.toggle('dyslexic-font');
    const isDyslexic = document.body.classList.contains('dyslexic-font');
    localStorage.setItem('dyslexicFont', isDyslexic);
}

// lang.js

// 1. Synchronously set the correct cookie before Google Translate loads
let currentLang = localStorage.getItem('portfolio-lang') || 'en';
if (currentLang === 'fr') {
    setCookie('googtrans', '/en/fr', 30);
    // Google might read domain specific, so set it for both
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/fr; expires=${new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; domain=${domain};`;
} else {
    // Ensure it's empty
    setCookie('googtrans', '', -1);
    setCookie('googtrans', '/en/en', -1);
}

// 2. Inject Google Translate script dynamically
const translateScript = document.createElement('script');
translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(translateScript);

// 3. Hide Google Translate UI and format body
const style = document.createElement('style');
style.innerHTML = `
    /* Hide the Google Translate toolbar */
    .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
    /* Prevent body from shifting down */
    body { top: 0px !important; }
    /* Hide the "Original text" popup */
    #goog-gt-tt { display: none !important; }
    .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
    /* Hide the Google Translate element div itself */
    #google_translate_element { display: none !important; }
`;
document.head.appendChild(style);

// 4. Google Translate Callback
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'fr', // Only include french as an option to translate to, since 'en' is default
        autoDisplay: false
    }, 'google_translate_element');
    
    // We rely on the googtrans cookie to auto-translate on load.
};

// 5. Function to toggle language button click
window.toggleLanguage = function() {
    const currentLang = localStorage.getItem('portfolio-lang') || 'en';
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    
    // Save preference
    localStorage.setItem('portfolio-lang', newLang);
    
    // Set Google Translate cookie
    if (newLang === 'fr') {
        setCookie('googtrans', '/en/fr', 30);
        const domain = window.location.hostname;
        document.cookie = `googtrans=/en/fr; expires=${new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; domain=${domain};`;
    } else {
        // Clear cookies to restore original English
        setCookie('googtrans', '', -1);
        setCookie('googtrans', '/en/en', -1);
        
        const domain = window.location.hostname;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    }
    
    // Reload page to apply changes properly
    window.location.reload();
};

// 6. Update the button UI
function updateLangUI(lang) {
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
        // If current is en, button shows "FR" to switch to French
        langLabel.textContent = lang === 'en' ? 'FR' : 'EN';
    }
}

// 7. Cookie helper function
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// 8. Initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    // Determine current language from localStorage or default to 'en'
    let currentLang = localStorage.getItem('portfolio-lang') || 'en';
    updateLangUI(currentLang);
});

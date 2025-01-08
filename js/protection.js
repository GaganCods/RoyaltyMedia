// Disable right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Disable keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Disable F12 key
    if(e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+Shift+I / Cmd+Option+I
    if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+U / Cmd+U (view source)
    if((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
    }
});

// Clear console on load
console.clear();
// Disable console.log and other console methods
console.log = console.warn = console.error = () => {};

// Add a warning message when DevTools is opened
let devtools = function() {};
devtools.toString = function() {
    return 'This site is protected. Developer tools are not allowed.';
};

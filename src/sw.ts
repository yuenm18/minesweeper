if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
            console.log('Service Worker registration successful with scope: ', registration);
        }, err => {
            console.log('Service Worker registration failed: ', err);
        });
    });
}
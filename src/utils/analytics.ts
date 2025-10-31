// Utility to conditionally load Google Analytics based on cookie consent

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_ID = 'G-PMWWQ1MN8V';

export const loadGoogleAnalytics = () => {
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // Load Google Tag Manager (noscript) is already in the HTML, but we can ensure it's loaded
  // The noscript iframe in index.html will handle non-JS scenarios
};

export const disableGoogleAnalytics = () => {
  // Set a flag to disable tracking
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};

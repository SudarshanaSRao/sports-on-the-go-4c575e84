import { useEffect } from 'react';

/**
 * Hook to handle dynamic viewport height on mobile devices
 * Accounts for browser chrome (address bar, toolbars) that change viewport height
 */
export function useMobileViewport() {
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Also set CSS custom property for dynamic viewport height
      if ('visualViewport' in window) {
        const visualVh = (window.visualViewport?.height || window.innerHeight) * 0.01;
        document.documentElement.style.setProperty('--dvh', `${visualVh}px`);
      }
    };

    // Set on mount
    setViewportHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // For visual viewport (better mobile support)
    if ('visualViewport' in window && window.visualViewport) {
      window.visualViewport.addEventListener('resize', setViewportHeight);
    }

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      if ('visualViewport' in window && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setViewportHeight);
      }
    };
  }, []);
}

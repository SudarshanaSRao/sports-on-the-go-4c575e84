/**
 * Mobile Optimization Utilities
 * Helpers for ensuring proper mobile viewport handling
 */

/**
 * Prevents body scroll when modals/dialogs are open (useful for iOS)
 */
export const preventBodyScroll = (prevent: boolean) => {
  if (prevent) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
  }
};

/**
 * Checks if the device is iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * Checks if the device is Android
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Checks if the device is Samsung (Android)
 */
export const isSamsung = (): boolean => {
  return /Samsung/.test(navigator.userAgent) && isAndroid();
};

/**
 * Gets the safe viewport height accounting for mobile browser chrome
 */
export const getSafeViewportHeight = (): number => {
  if ('visualViewport' in window && window.visualViewport) {
    return window.visualViewport.height;
  }
  return window.innerHeight;
};

/**
 * Scrolls to top with mobile-optimized behavior
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

/**
 * Ensures element is visible in viewport (useful for inputs on mobile)
 */
export const scrollIntoViewIfNeeded = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
  if (!isVisible) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
  }
};

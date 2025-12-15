// No-op gtag fallback to avoid runtime errors in development
if (typeof window !== 'undefined') {
  try {
    if (typeof window.gtag !== 'function') {
      window.gtag = function () {
        // noop in dev when analytics not loaded
      };
    }
  } catch (e) {
    // ignore
  }
}

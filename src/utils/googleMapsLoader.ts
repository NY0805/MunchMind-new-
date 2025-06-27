let isLoaded = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  if (isLoaded) {
    return Promise.resolve();
  }

  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Check if Google Maps is already loaded
  if (window.google && window.google.maps) {
    isLoaded = true;
    return Promise.resolve();
  }

  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };
    
    script.onerror = () => {
      isLoading = false;
      loadPromise = null;
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });

  return loadPromise;
};

// Global type declaration
declare global {
  interface Window {
    google: any;
  }
}
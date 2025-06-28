import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { loadGoogleMapsAPI } from '../utils/googleMapsLoader';

interface Restaurant {
  id: number;
  name: string;
  cuisine?: string;
  rating?: number;
  distance?: number;
  isOpen?: boolean;
  image?: string;
  // description?: string;
  address?: string;
  phone?: string;
  coordinates: { lat: number; lng: number };
  averageCalories?: number;
  specialDish?: string;
  priceLevel?: number;
  placeId?: string; // Add place ID for detailed API calls
  photos?: string[];
  reviews?: any[];
  openingHours?: string[];
  userRatingsTotal?: number;
}

interface GoogleMapProps {
  restaurants: Restaurant[];
  onRestaurantSelect: (restaurant: Restaurant) => void;
  userLocation: { lat: number; lng: number } | null;
  onRestaurantsUpdate: (restaurants: Restaurant[]) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  restaurants,
  onRestaurantSelect,
  userLocation,
  onRestaurantsUpdate
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Get random restaurant image
  const getRandomRestaurantImage = (): string => {
    const images = [
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
      'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
      'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
      'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Get random special dish based on cuisine
  const getRandomSpecialDish = (cuisine?: string): string => {
    const dishes: { [key: string]: string[] } = {
      italian: ['Pasta Carbonara', 'Margherita Pizza', 'Risotto'],
      chinese: ['Kung Pao Chicken', 'Sweet & Sour Pork', 'Fried Rice'],
      indian: ['Butter Chicken', 'Biryani', 'Curry'],
      mexican: ['Tacos', 'Burrito', 'Quesadilla'],
      japanese: ['Sushi', 'Ramen', 'Tempura'],
      thai: ['Pad Thai', 'Green Curry', 'Tom Yum'],
      french: ['Coq au Vin', 'Ratatouille', 'Croissant'],
      american: ['Burger', 'BBQ Ribs', 'Mac & Cheese'],
    };

    const cuisineKey = cuisine?.toLowerCase() || 'american';
    const dishList = dishes[cuisineKey] || dishes.american;
    return dishList[Math.floor(Math.random() * dishList.length)];
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get place details including reviews, photos, and opening hours
  const getPlaceDetails = async (placeId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject(new Error('Google Maps not loaded'));
        return;
      }

      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      const request = {
        placeId: placeId,
        fields: [
          'name', 'rating', 'user_ratings_total', 'reviews', 'photos', 
          'opening_hours', 'formatted_phone_number', 'formatted_address',
          'price_level', 'types', 'geometry'
        ]
      };

      service.getDetails(request, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(new Error(`Place details request failed: ${status}`));
        }
      });
    });
  };

  // Generate photo URL from photo reference
  const getPhotoUrl = (photoReference: string, maxWidth: number = 800): string => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  };

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  // Initialize map
  const initializeMap = async () => {
    if (!mapRef.current || !userLocation) return;

    try {
      await loadGoogleMapsAPI();
      
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps API not loaded');
      }

      // Map styles for dark theme
      const darkMapStyles = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ];

      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 14,
        styles: theme === 'dark' ? darkMapStyles : [],
        zIndex: 1,
      });

      mapInstanceRef.current = map;

      // Add prominent user location marker
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
        zIndex: 1000,
      });

      // Search for nearby restaurants (not hotels)
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: { lat: userLocation.lat, lng: userLocation.lng },
        radius: 10000, // 10km radius
        type: 'restaurant', // Specifically search for restaurants
        keyword: 'restaurant food dining', // Additional keywords to ensure we get restaurants
      };

      service.nearbySearch(request, async (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // Filter out hotels and lodging establishments
          const filteredResults = results.filter((place: any) => {
            const types = place.types || [];
            // Exclude hotels, lodging, and accommodation types
            const excludeTypes = ['lodging', 'hotel', 'motel', 'resort', 'hostel', 'guest_house', 'bed_and_breakfast'];
            return !types.some((type: string) => excludeTypes.includes(type)) && 
                   (types.includes('restaurant') || types.includes('food') || types.includes('meal_takeaway'));
          });

          const nearbyRestaurants: Restaurant[] = [];

          // Process each restaurant and get detailed information
          for (let i = 0; i < Math.min(filteredResults.length, 20); i++) {
            const place = filteredResults[i];
            
            try {
              // Get detailed place information
              const placeDetails = await getPlaceDetails(place.place_id);
              
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                place.geometry.location.lat(),
                place.geometry.location.lng()
              );

              // Extract photos and generate URLs
              const photos = placeDetails.photos && placeDetails.photos.length > 0
  ? placeDetails.photos.slice(0, 5).map((photo: any) => {
      if (photo.getUrl) {
        // Google's Places Photo object sometimes gives a getUrl() function instead of reference
        return photo.getUrl({ maxWidth: 800 });
      } else if (photo.photo_reference) {
        return getPhotoUrl(photo.photo_reference);
      } else {
        return null;
      }
    }).filter((url: string | null) => url !== null)
  : [];


              // Extract reviews
              const reviews = placeDetails.reviews ? 
                placeDetails.reviews.slice(0, 5).map((review: any) => ({
                  author: review.author_name,
                  rating: review.rating,
                  text: review.text,
                  date: review.relative_time_description,
                  profilePhoto: review.profile_photo_url
                })) : [];

              // Extract opening hours
              const openingHours = placeDetails.opening_hours?.weekday_text || [];

              const restaurant: Restaurant = {
                id: place.place_id ? place.place_id.hashCode() : Date.now() + i,
                name: place.name || 'Unknown Restaurant',
                cuisine: place.types?.[0]?.replace(/_/g, ' ') || 'Restaurant',
                rating: placeDetails.rating || place.rating || 3.5 + Math.random() * 1.5,
                distance: Math.round(distance * 100) / 100,
                isOpen: placeDetails.opening_hours?.isOpen() ?? false,
                image: photos[0] || getRandomRestaurantImage(),
                address: placeDetails.formatted_address || place.vicinity || 'Address not available',
                phone: placeDetails.formatted_phone_number || 'Phone not available',
                coordinates: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                },
                priceLevel: placeDetails.price_level || place.price_level || Math.floor(Math.random() * 3) + 1,
                specialDish: getRandomSpecialDish(place.types?.[0]),
                placeId: place.place_id,
                photos: photos,
                reviews: reviews,
                openingHours: openingHours,
                userRatingsTotal: placeDetails.user_ratings_total || 0
              };

              nearbyRestaurants.push(restaurant);
            } catch (error) {
              console.error('Error getting place details for', place.name, error);
              
              // Fallback to basic information if detailed request fails
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                place.geometry.location.lat(),
                place.geometry.location.lng()
              );

              const restaurant: Restaurant = {
                id: place.place_id ? place.place_id.hashCode() : Date.now() + i,
                name: place.name || 'Unknown Restaurant',
                cuisine: place.types?.[0]?.replace(/_/g, ' ') || 'Restaurant',
                rating: place.rating || 3.5 + Math.random() * 1.5,
                distance: Math.round(distance * 100) / 100,
                isOpen: place.opening_hours?.isOpen() ?? false,
                image: getRandomRestaurantImage(),
                address: place.vicinity || 'Address not available',
                phone: 'Phone not available',
                coordinates: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                },
                priceLevel: place.price_level || Math.floor(Math.random() * 3) + 1,
                specialDish: getRandomSpecialDish(place.types?.[0]),
                placeId: place.place_id,
                photos: [],
                reviews: [],
                openingHours: [],
                userRatingsTotal: 0
              };

              nearbyRestaurants.push(restaurant);
            }
          }

          // Create single info window to reuse
          infoWindowRef.current = new window.google.maps.InfoWindow();

          // Add markers for restaurants
          nearbyRestaurants.forEach((restaurant) => {
            const marker = new window.google.maps.Marker({
              position: { lat: restaurant.coordinates.lat, lng: restaurant.coordinates.lng },
              map: map,
              title: restaurant.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: restaurant.isOpen ? '#10B981' : '#EF4444',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
              zIndex: 100,
            });

            marker.addListener('click', () => {
              // Close previous info window
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }

              // Set new content and open
              infoWindowRef.current.setContent(`
                <div style="max-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold;">${restaurant.name}</h3>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${restaurant.address}</p>
                  <p style="margin: 0 0 4px 0; font-size: 12px;">⭐ ${restaurant.rating?.toFixed(1)} • ${restaurant.distance}km</p>
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: ${restaurant.isOpen ? '#10B981' : '#EF4444'};">
                    ${restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                  </p>
                  <button onclick="window.selectRestaurant(${restaurant.id})" 
                          style="background: #f97316; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    View Details
                  </button>
                </div>
              `);
              infoWindowRef.current.open(map, marker);
            });

            markersRef.current.push(marker);
          });

          // Make restaurant selection available globally
          (window as any).selectRestaurant = (restaurantId: number) => {
            const restaurant = nearbyRestaurants.find(r => r.id === restaurantId);
            if (restaurant) {
              // Close info window when navigating
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
              onRestaurantSelect(restaurant);
            }
          };

          onRestaurantsUpdate(nearbyRestaurants);
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load map');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      initializeMap();
    }

    return () => {
      clearMarkers();
      if ((window as any).selectRestaurant) {
        delete (window as any).selectRestaurant;
      }
    };
  }, [userLocation, theme]);

  if (!userLocation) {
    return (
      <div className={`h-80 rounded-xl flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Getting your location...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-80 rounded-xl flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute top-2 left-2 z-[1000] bg-white rounded-lg shadow-lg p-2">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            <span className="text-sm text-gray-600">Loading restaurants...</span>
          </div>
        </div>
      )}

      <div 
        ref={mapRef} 
        className="h-80 rounded-xl shadow-lg"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

// Helper function to generate hash code from string
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export default GoogleMap;
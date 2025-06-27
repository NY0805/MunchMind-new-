import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, Phone, Navigation, Heart, ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToFavourites, removeFromFavourites, isFavourite } = useFavourites();
  
  // Get restaurant data from navigation state
  const restaurant = location.state?.restaurant;
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showImageModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showImageModal]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Restaurant not found
          </h2>
          <button
            onClick={() => navigate('/explore')}
            className={`px-4 py-2 rounded-lg ${
              theme === 'synesthesia'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            } transition-colors`}
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    const foodItem = {
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.image,
      description: restaurant.description,
      nutrition: `${getPriceLevelDisplay(restaurant.priceLevel)} price range`,
      mood: 'neutral'
    };

    if (isFavourite(restaurant.id)) {
      removeFromFavourites(restaurant.id);
    } else {
      // Store restaurant location
      localStorage.setItem(`location_${restaurant.id}`, restaurant.address);
      addToFavourites(foodItem);
    }
  };

  const handleNavigate = () => {
    const { lat, lng } = restaurant.coordinates || {};
    if (lat && lng) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleCall = () => {
    if (restaurant.phone && restaurant.phone !== 'Phone not available') {
      window.location.href = `tel:${restaurant.phone}`;
    }
  };

  const getPriceLevelDisplay = (level: number): string => {
    return '$'.repeat(level || 2);
  };

  const getPriceLevelDescription = (level: number): string => {
    switch (level) {
      case 1: return 'Inexpensive';
      case 2: return 'Moderate';
      case 3: return 'Expensive';
      case 4: return 'Very Expensive';
      default: return 'Moderate';
    }
  };

  const handleImageClick = (index: number = 0) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.5, 1));
  };

  const handleImageDrag = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * -100;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -100;
      setImagePosition({ x, y });
    }
  };

  const nextImage = () => {
    if (restaurant.photos && restaurant.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % restaurant.photos.length);
    }
  };

  const prevImage = () => {
    if (restaurant.photos && restaurant.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + restaurant.photos.length) % restaurant.photos.length);
    }
  };

  const getCurrentDayIndex = (): number => {
    return new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  const formatOpeningHours = (hours: string[]): { day: string; hours: string; isToday: boolean }[] => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = getCurrentDayIndex();
    
    return hours.map((hourString, index) => {
      const parts = hourString.split(': ');
      const day = parts[0];
      const hours = parts[1] || 'Closed';
      
      return {
        day,
        hours,
        isToday: index === today
      };
    });
  };

  return (
    <>
      <div className={`min-h-screen ${
        theme === 'synesthesia' 
          ? 'bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100' 
          : theme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-50'
      }`}>
        {/* Header Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/explore')}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Favorite Button - Same style as AI Chef */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
              isFavourite(restaurant.id)
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }`}
          >
            <Heart size={18} fill={isFavourite(restaurant.id) ? "white" : "none"} />
          </button>

          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-white/90 mb-2">{restaurant.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                {restaurant.userRatingsTotal > 0 && (
                  <span className="text-sm text-white/80">({restaurant.userRatingsTotal})</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{restaurant.distance}km away</span>
              </div>
              <div className={`flex items-center gap-1 ${
                restaurant.isOpen ? 'text-green-400' : 'text-red-400'
              }`}>
                <Clock size={16} />
                <span>{restaurant.isOpen ? 'Open' : 'Closed'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="responsive-container py-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleNavigate}
              className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
            >
              <Navigation size={18} />
              Navigate
            </button>
            <button
              onClick={handleCall}
              disabled={!restaurant.phone || restaurant.phone === 'Phone not available'}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                !restaurant.phone || restaurant.phone === 'Phone not available'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-white text-gray-800 hover:bg-gray-100'
                    : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Phone size={18} />
              Call
            </button>
          </div>

          {/* Restaurant Details */}
          <div className={`rounded-xl mb-6 p-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Restaurant Information
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {restaurant.address || 'Address not available'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {restaurant.phone || 'Phone not available'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-gray-500" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {restaurant.cuisine || 'Cuisine type'} • {getPriceLevelDisplay(restaurant.priceLevel)}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs - Only Reviews and Info */}
          <div className={`rounded-xl overflow-hidden shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-3 px-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-orange-500 text-orange-500'
                    : theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:text-gray-200'
                      : 'border-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 px-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'info'
                    ? 'border-orange-500 text-orange-500'
                    : theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:text-gray-200'
                      : 'border-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                Info
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'reviews' && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    Customer Reviews
                  </h3>
                  
                  {/* Overall Rating Summary */}
                  <div className={`p-4 rounded-lg mb-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {restaurant.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`${
                                star <= Math.round(restaurant.rating)
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className={`text-sm mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {restaurant.userRatingsTotal} reviews
                        </div>
                      </div>
                    </div>
                  </div>

                  {restaurant.reviews && restaurant.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {restaurant.reviews.map((review: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              {review.profilePhoto && (
                                <img
                                  src={review.profilePhoto}
                                  alt={review.author}
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <span className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-800'
                              }`}>
                                {review.author}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500 fill-current" />
                              <span className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {review.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {review.text}
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {review.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-8 text-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    } rounded-lg`}>
                      <p className={`text-lg ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        No reviews available
                      </p>
                      <p className={`text-sm mt-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Be the first to leave a review for this restaurant
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'info' && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    Restaurant Information
                  </h3>
                  <div className="space-y-4">
                    {/* Opening Hours */}
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <h4 className={`font-medium mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        Opening Hours
                      </h4>
                      {restaurant.openingHours && restaurant.openingHours.length > 0 ? (
                        <div className="space-y-1 text-sm">
                          {formatOpeningHours(restaurant.openingHours).map((dayInfo, index) => (
                            <div key={index} className={`flex justify-between ${
                              dayInfo.isToday ? 'font-semibold' : ''
                            } ${dayInfo.isToday && theme === 'synesthesia' ? 'text-purple-600' : 
                               dayInfo.isToday && theme !== 'dark' ? 'text-orange-600' :
                               dayInfo.isToday ? 'text-orange-400' : 
                               theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              <span>{dayInfo.day}</span>
                              <span>{dayInfo.hours}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Opening hours not available
                        </p>
                      )}
                    </div>

                    {/* Price Range */}
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <h4 className={`font-medium mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        Price Range
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getPriceLevelDisplay(restaurant.priceLevel)} - {getPriceLevelDescription(restaurant.priceLevel)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showImageModal && restaurant.photos && restaurant.photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white z-10"
          >
            <X size={24} />
          </button>
          
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <ZoomIn size={24} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <ZoomOut size={24} />
            </button>
          </div>

          {/* Navigation arrows */}
          {restaurant.photos.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image counter */}
          {restaurant.photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm z-10">
              {currentImageIndex + 1} / {restaurant.photos.length}
            </div>
          )}
          
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onMouseMove={handleImageDrag}
          >
            <img
              src={restaurant.photos[currentImageIndex]}
              alt={`Restaurant photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform cursor-move"
              style={{ 
                transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                transformOrigin: 'center'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantDetails;
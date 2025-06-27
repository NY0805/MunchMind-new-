import React, { useEffect } from 'react';
import { X, Utensils, Heart, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavourites } from '../../context/FavouritesContext';
import { useUser } from '../../context/UserContext';

interface PersonalizedRecommendationsProps {
  isOpen: boolean;
  onClose: () => void;
  nutrients: Array<{
    name: string;
    value: number;
    goal: number;
    color: string;
  }>;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  isOpen,
  onClose,
  nutrients
}) => {
  const { theme } = useTheme();
  const { addToFavourites, isFavourite } = useFavourites();
  const { isValidUser } = useUser();
  const navigate = useNavigate();

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate recommendations based on nutrients below 70%
  const generateRecommendations = () => {
    const lowNutrients = nutrients.filter(nutrient => nutrient.value < 70);
    
    const recommendations = {
      Protein: [
        { 
          id: 8001,
          name: 'Grilled Salmon', 
          description: 'Rich in high-quality protein and omega-3 fatty acids', 
          image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
          time: '25 min',
          difficulty: 'Medium',
          ingredients: ['Fresh salmon fillet', 'Olive oil', 'Lemon', 'Herbs', 'Salt and pepper'],
          steps: ['Preheat grill', 'Season salmon', 'Grill for 4-5 minutes per side', 'Serve with lemon']
        },
        { 
          id: 8002,
          name: 'Greek Yogurt Bowl', 
          description: 'Packed with protein and probiotics for gut health', 
          image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
          time: '10 min',
          difficulty: 'Easy',
          ingredients: ['Greek yogurt', 'Berries', 'Granola', 'Honey', 'Nuts'],
          steps: ['Add yogurt to bowl', 'Top with berries and granola', 'Drizzle with honey', 'Add nuts']
        }
      ],
      Fiber: [
        { 
          id: 8003,
          name: 'Quinoa Salad', 
          description: 'High-fiber grain with complete protein profile', 
          image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
          time: '30 min',
          difficulty: 'Easy',
          ingredients: ['Quinoa', 'Mixed vegetables', 'Olive oil', 'Lemon juice', 'Fresh herbs'],
          steps: ['Cook quinoa', 'Chop vegetables', 'Mix with dressing', 'Add herbs and serve']
        },
        { 
          id: 8004,
          name: 'Berry Smoothie Bowl', 
          description: 'Loaded with fiber, antioxidants, and natural sweetness', 
          image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
          time: '15 min',
          difficulty: 'Easy',
          ingredients: ['Mixed berries', 'Banana', 'Chia seeds', 'Almond milk', 'Granola'],
          steps: ['Blend fruits with milk', 'Pour into bowl', 'Top with chia seeds', 'Add granola']
        }
      ],
      Iron: [
        { 
          id: 8005,
          name: 'Spinach & Lentil Curry', 
          description: 'Iron-rich vegetables and legumes in aromatic spices', 
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
          time: '35 min',
          difficulty: 'Medium',
          ingredients: ['Red lentils', 'Fresh spinach', 'Curry spices', 'Coconut milk', 'Onions'],
          steps: ['Sauté onions', 'Add spices and lentils', 'Simmer with coconut milk', 'Add spinach']
        },
        { 
          id: 8006,
          name: 'Beef & Broccoli Stir-fry', 
          description: 'Heme iron from lean beef with vitamin C for absorption', 
          image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
          time: '20 min',
          difficulty: 'Medium',
          ingredients: ['Lean beef strips', 'Fresh broccoli', 'Soy sauce', 'Garlic', 'Ginger'],
          steps: ['Marinate beef', 'Stir-fry beef until browned', 'Add broccoli', 'Toss with sauce']
        }
      ],
      Calcium: [
        { 
          id: 8007,
          name: 'Kale & Almond Salad', 
          description: 'Calcium-rich greens with crunchy almonds', 
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          time: '15 min',
          difficulty: 'Easy',
          ingredients: ['Fresh kale', 'Sliced almonds', 'Parmesan cheese', 'Lemon dressing', 'Olive oil'],
          steps: ['Massage kale with dressing', 'Add almonds and cheese', 'Toss well', 'Serve fresh']
        },
        { 
          id: 8008,
          name: 'Sardine Toast', 
          description: 'Bone-in fish providing excellent calcium content', 
          image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
          time: '10 min',
          difficulty: 'Easy',
          ingredients: ['Whole grain bread', 'Canned sardines', 'Avocado', 'Lemon', 'Black pepper'],
          steps: ['Toast bread', 'Mash avocado', 'Top with sardines', 'Season and serve']
        }
      ],
      'Vitamin C': [
        { 
          id: 8009,
          name: 'Citrus Fruit Salad', 
          description: 'Fresh oranges, grapefruits, and kiwi for vitamin C boost', 
          image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
          time: '15 min',
          difficulty: 'Easy',
          ingredients: ['Orange segments', 'Grapefruit', 'Kiwi', 'Fresh mint', 'Honey'],
          steps: ['Segment citrus fruits', 'Slice kiwi', 'Combine in bowl', 'Add mint and honey']
        },
        { 
          id: 8010,
          name: 'Bell Pepper Stir-fry', 
          description: 'Colorful peppers packed with vitamin C and antioxidants', 
          image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
          time: '15 min',
          difficulty: 'Easy',
          ingredients: ['Mixed bell peppers', 'Onions', 'Garlic', 'Olive oil', 'Herbs'],
          steps: ['Heat oil in pan', 'Add peppers and onions', 'Stir-fry until tender', 'Season with herbs']
        }
      ],
      'Omega-3': [
        { 
          id: 8011,
          name: 'Chia Seed Pudding', 
          description: 'Plant-based omega-3s with fiber and protein', 
          image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
          time: '5 min prep + 2h chill',
          difficulty: 'Easy',
          ingredients: ['Chia seeds', 'Almond milk', 'Vanilla', 'Maple syrup', 'Fresh berries'],
          steps: ['Mix chia with milk', 'Add vanilla and syrup', 'Refrigerate 2 hours', 'Top with berries']
        },
        { 
          id: 8012,
          name: 'Walnut-Crusted Fish', 
          description: 'Double dose of omega-3s from fish and walnuts', 
          image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
          time: '30 min',
          difficulty: 'Medium',
          ingredients: ['White fish fillet', 'Crushed walnuts', 'Herbs', 'Olive oil', 'Lemon'],
          steps: ['Coat fish with walnuts', 'Bake until golden', 'Serve with lemon', 'Garnish with herbs']
        }
      ]
    };

    const allRecommendations: Array<{
      id: number;
      name: string;
      description: string;
      image: string;
      nutrient: string;
      time: string;
      difficulty: string;
      ingredients: string[];
      steps: string[];
    }> = [];

    lowNutrients.forEach(nutrient => {
      const foods = recommendations[nutrient.name as keyof typeof recommendations] || [];
      foods.forEach(food => {
        allRecommendations.push({
          ...food,
          nutrient: nutrient.name
        });
      });
    });

    return allRecommendations.slice(0, 6); // Limit to 6 recommendations
  };

  const recommendations = generateRecommendations();

  const handleGetRecipe = (rec: any) => {
    // Navigate to AI Chef with the recipe
    const recipe = {
      id: rec.id,
      name: rec.name,
      image: rec.image,
      time: rec.time,
      difficulty: rec.difficulty,
      ingredients: rec.ingredients,
      steps: rec.steps
    };
    
    sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
    onClose();
    navigate('/ai-chef?loadRecipe=true');
  };

  const handleFavoriteToggle = (rec: any) => {
    if (!isValidUser()) {
      // Show login prompt for guests
      alert('Please log in to save favorites');
      return;
    }

    const foodItem = {
      id: rec.id,
      name: rec.name,
      image: rec.image,
      description: rec.description,
      nutrition: `Rich in ${rec.nutrient}`,
      mood: 'healthy'
    };

    // Store location as "AI Chef Recipe" for nutritional recommendations
    localStorage.setItem(`location_${rec.id}`, 'AI Chef Recipe');
    addToFavourites(foodItem);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" style={{ 
      height: 'calc(100vh + 45px)', 
      width: '100vw', 
      top: '-20px', 
      left: 0,
      padding: '1rem'
    }}>
      <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`p-6 ${
          theme === 'synesthesia'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
            : 'bg-gradient-to-r from-orange-500 to-amber-500'
        } text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <Utensils size={24} />
            <div>
              <h2 className="text-xl font-bold">Personalized Recommendations</h2>
              <p className="text-white/90 text-sm">Based on your Nutritional DNA</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                theme === 'synesthesia' ? 'bg-purple-100' : 'bg-orange-100'
              }`}>
                <Utensils size={24} className={
                  theme === 'synesthesia' ? 'text-purple-500' : 'text-orange-500'
                } />
              </div>
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Great Nutrition Balance!
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your nutritional levels look good. Keep up the great work!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Based on your nutritional gaps, here are some foods that can help boost your levels:
              </p>
              
              {recommendations.map((rec, index) => (
                <div key={index} className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-opacity-80 ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`} onClick={() => handleGetRecipe(rec)}>
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {rec.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(rec);
                        }}
                        className={`p-1 rounded-full transition-colors ${
                          isFavourite(rec.id)
                            ? 'text-red-500'
                            : theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={16} fill={isFavourite(rec.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        theme === 'synesthesia'
                          ? 'bg-purple-100 text-purple-700'
                          : theme === 'dark'
                            ? 'bg-orange-900/30 text-orange-400'
                            : 'bg-orange-100 text-orange-700'
                      }`}>
                        Rich in {rec.nutrient}
                      </span>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {rec.time} • {rec.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
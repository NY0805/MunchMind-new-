import React, { useState } from 'react';
import { Clock, ChefHat, Filter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const allRecipeSuggestions = [
  {
    id: 1,
    name: 'Spinach and Egg Breakfast Bowl',
    image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
    time: '15 min',
    difficulty: 'Easy',
    match: 90,
    ingredients: ['2 eggs', '1 cup spinach', '1/2 onion, diced', 'Salt and pepper to taste'],
    steps: ['Sauté diced onions until translucent', 'Add spinach and cook until wilted', 'Make two wells in the mixture and crack eggs into them', 'Cover and cook until eggs are set', 'Season with salt and pepper']
  },
  {
    id: 2,
    name: 'Chicken and Vegetable Stir Fry',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
    time: '25 min',
    difficulty: 'Medium',
    match: 85,
    ingredients: ['300g chicken breast, sliced', '1 onion, sliced', '2 cups mixed vegetables', 'Soy sauce', 'Garlic and ginger'],
    steps: ['Marinate chicken in soy sauce, minced garlic and ginger', 'Heat oil in a wok or large pan', 'Stir-fry chicken until golden and cooked through', 'Add vegetables and stir-fry until tender-crisp', 'Add sauce and toss to combine', 'Serve hot over rice or noodles']
  },
  {
    id: 3,
    name: 'Simple Spinach Omelette',
    image: 'https://images.pexels.com/photos/6294291/pexels-photo-6294291.jpeg',
    time: '10 min',
    difficulty: 'Easy',
    match: 95,
    ingredients: ['3 eggs', '1 cup spinach, chopped', '1/4 onion, finely diced', 'Salt and pepper to taste'],
    steps: ['Beat eggs in a bowl with salt and pepper', 'Heat a non-stick pan with a little oil', 'Sauté onions until translucent', 'Add spinach and cook until wilted', 'Pour egg mixture over vegetables', 'Cook until mostly set, then fold in half', 'Serve immediately']
  },
  {
    id: 4,
    name: 'Garlic Butter Pasta',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    time: '20 min',
    difficulty: 'Easy',
    match: 80,
    ingredients: ['400g pasta', '4 cloves garlic', '100g butter', 'Parmesan cheese', 'Fresh herbs'],
    steps: ['Cook pasta according to package instructions', 'Melt butter in a large pan', 'Add minced garlic and cook until fragrant', 'Toss cooked pasta with garlic butter', 'Add Parmesan and herbs', 'Serve immediately']
  },
  {
    id: 5,
    name: 'Mediterranean Quinoa Salad',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    time: '30 min',
    difficulty: 'Medium',
    match: 75,
    ingredients: ['1 cup quinoa', 'Cherry tomatoes', 'Cucumber', 'Feta cheese', 'Olive oil', 'Lemon juice'],
    steps: ['Cook quinoa according to package instructions', 'Let quinoa cool completely', 'Dice tomatoes and cucumber', 'Crumble feta cheese', 'Mix all ingredients with olive oil and lemon juice', 'Season with salt and pepper']
  },
  {
    id: 6,
    name: 'Beef and Broccoli Stir Fry',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
    time: '35 min',
    difficulty: 'Advanced',
    match: 70,
    ingredients: ['500g beef strips', 'Fresh broccoli', 'Soy sauce', 'Oyster sauce', 'Garlic', 'Ginger'],
    steps: ['Marinate beef in soy sauce and cornstarch', 'Blanch broccoli until bright green', 'Heat wok to high temperature', 'Stir-fry beef until browned', 'Add broccoli and sauce', 'Toss until heated through']
  },
  {
    id: 7,
    name: 'Creamy Mushroom Risotto',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    time: '45 min',
    difficulty: 'Advanced',
    match: 65,
    ingredients: ['Arborio rice', 'Mixed mushrooms', 'Vegetable stock', 'White wine', 'Parmesan', 'Butter'],
    steps: ['Sauté mushrooms until golden', 'Toast rice in butter', 'Add wine and let absorb', 'Gradually add warm stock', 'Stir constantly for 20 minutes', 'Finish with Parmesan and butter']
  },
  {
    id: 8,
    name: 'Thai Green Curry',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
    time: '40 min',
    difficulty: 'Advanced',
    match: 60,
    ingredients: ['Green curry paste', 'Coconut milk', 'Chicken or tofu', 'Thai basil', 'Vegetables', 'Fish sauce'],
    steps: ['Fry curry paste until fragrant', 'Add thick coconut milk', 'Add protein and cook through', 'Add vegetables and remaining coconut milk', 'Season with fish sauce and sugar', 'Garnish with Thai basil']
  },
  {
    id: 9,
    name: 'Classic Caesar Salad',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    time: '15 min',
    difficulty: 'Easy',
    match: 85,
    ingredients: ['Romaine lettuce', 'Caesar dressing', 'Croutons', 'Parmesan cheese', 'Anchovies'],
    steps: ['Wash and chop romaine lettuce', 'Make Caesar dressing from scratch', 'Toss lettuce with dressing', 'Add croutons and Parmesan', 'Garnish with anchovies if desired']
  },
  {
    id: 10,
    name: 'Chocolate Lava Cake',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    time: '25 min',
    difficulty: 'Medium',
    match: 55,
    ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla'],
    steps: ['Melt chocolate and butter', 'Whisk eggs and sugar until pale', 'Fold in chocolate mixture', 'Add flour and vanilla', 'Bake in ramekins for 12 minutes', 'Serve immediately with ice cream']
  }
];

interface RecipeSuggestionsProps {
  onSelectRecipe: (recipe: any) => void;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ onSelectRecipe }) => {
  const [showAll, setShowAll] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const { theme } = useTheme();

  const filteredRecipes = allRecipeSuggestions.filter(recipe => {
    if (!difficultyFilter) return true;
    return recipe.difficulty === difficultyFilter;
  });

  const displayedRecipes = showAll ? filteredRecipes.slice(0, 10) : filteredRecipes.slice(0, 3);

  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-semibold text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Recipe Suggestions
          </h3>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className={`text-xs px-2 py-1 rounded border ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              } focus:outline-none`}
            >
              <option value="">Mixed Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {displayedRecipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className={`rounded-lg overflow-hidden shadow-sm ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => onSelectRecipe(recipe)}
            >
              <div className="flex h-24">
                <div className="w-1/3">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="w-2/3 p-3">
                  <h4 className={`font-medium text-sm mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {recipe.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {recipe.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <ChefHat size={12} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      recipe.match >= 90
                        ? theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                        : theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {recipe.match}% match
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!showAll && filteredRecipes.length > 3 && (
          <button 
            onClick={() => setShowAll(true)}
            className={`mt-4 w-full py-2 text-sm rounded-full ${
              theme === 'synesthesia'
                ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                : theme === 'dark'
                  ? 'bg-gray-700 text-orange-400 hover:bg-gray-600'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            } transition-colors`}
          >
            Show More Suggestions
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeSuggestions;
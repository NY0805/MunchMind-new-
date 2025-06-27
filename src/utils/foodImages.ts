// Food image variants for different meals
export const foodImageVariants = {
  // Pasta dishes
  pasta: [
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'
  ],
  
  // Asian cuisine
  curry: [
    'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    'https://images.pexels.com/photos/5737242/pexels-photo-5737242.jpeg'
  ],
  
  // Desserts
  dessert: [
    'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',
    'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    'https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg'
  ],
  
  // Salads and bowls
  salad: [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg'
  ],
  
  // Comfort food
  comfort: [
    'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg'
  ],
  
  // Seafood
  seafood: [
    'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
    'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
  ],
  
  // Meat dishes
  meat: [
    'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg'
  ],
  
  // Breakfast
  breakfast: [
    'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
    'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
    'https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg'
  ],
  
  // Burgers and sandwiches
  burger: [
    'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
    'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg'
  ],
  
  // Drinks and beverages
  drink: [
    'https://images.pexels.com/photos/4790070/pexels-photo-4790070.jpeg',
    'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg'
  ]
};

// Function to get a random image variant for a food category
export const getRandomFoodImage = (category: string): string => {
  const variants = foodImageVariants[category as keyof typeof foodImageVariants];
  if (!variants) {
    // Fallback to a default set if category not found
    const defaultImages = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }
  
  return variants[Math.floor(Math.random() * variants.length)];
};

// Function to categorize food by name
export const categorizeFoodByName = (foodName: string): string => {
  const name = foodName.toLowerCase();
  
  if (name.includes('pasta') || name.includes('spaghetti') || name.includes('linguine')) return 'pasta';
  if (name.includes('curry') || name.includes('thai') || name.includes('spicy')) return 'curry';
  if (name.includes('chocolate') || name.includes('pudding') || name.includes('cake') || name.includes('dessert')) return 'dessert';
  if (name.includes('salad') || name.includes('bowl') || name.includes('quinoa')) return 'salad';
  if (name.includes('mac') || name.includes('cheese') || name.includes('stew') || name.includes('comfort')) return 'comfort';
  if (name.includes('salmon') || name.includes('fish') || name.includes('seafood') || name.includes('shrimp')) return 'seafood';
  if (name.includes('beef') || name.includes('chicken') || name.includes('meat') || name.includes('stir fry')) return 'meat';
  if (name.includes('pancake') || name.includes('toast') || name.includes('breakfast') || name.includes('smoothie')) return 'breakfast';
  if (name.includes('burger') || name.includes('sandwich') || name.includes('patty')) return 'burger';
  if (name.includes('coffee') || name.includes('latte') || name.includes('drink') || name.includes('beer')) return 'drink';
  
  return 'salad'; // Default fallback
};

// Function to get realistic location names
export const getRealisticLocation = (foodName: string): string => {
  const name = foodName.toLowerCase();
  
  // Specific food to location mappings
  const locationMappings: { [key: string]: string[] } = {
    ramen: ['Ichiraku Ramen Tokyo', 'Noodle House Shibuya', 'Ramen Yokocho'],
    tacos: ['La Taquería CDMX', 'Tacos El Primo', 'Street Tacos Plaza'],
    croissant: ['Maison du Croissant Paris', 'Boulangerie Centrale', 'Café de Flore'],
    satay: ['Satay Street KL', 'Hawker Center Singapore', 'Night Market Penang'],
    sushi: ['Osaka Sushi Bar', 'Tokyo Fish Market', 'Sushi Zen'],
    pizza: ['Napoli Pizza Piazza', 'Tony\'s Pizzeria', 'Wood Fire Kitchen'],
    burger: ['Big Bite NYC', 'Burger Joint Brooklyn', 'The Grill House'],
    curry: ['Spice Mahal Delhi', 'Curry Palace Mumbai', 'Thai Garden Bangkok'],
    pasta: ['Nonna\'s Kitchen Rome', 'Pasta Fresca Milano', 'Little Italy Bistro'],
    coffee: ['Central Perk Café', 'Roasters Corner', 'Bean There Coffee'],
    pancakes: ['Stack House Diner', 'Maple Syrup Café', 'Morning Glory'],
    salmon: ['Fresh Catch Harbor', 'Nordic Fish House', 'Seaside Grill'],
    chocolate: ['Sweet Dreams Chocolatier', 'Cocoa Corner', 'Dessert Paradise']
  };
  
  // Find matching category
  for (const [key, locations] of Object.entries(locationMappings)) {
    if (name.includes(key)) {
      return locations[Math.floor(Math.random() * locations.length)];
    }
  }
  
  // Generic restaurant names as fallback
  const genericLocations = [
    'Corner Bistro',
    'Main Street Eatery',
    'Garden Café',
    'The Local Kitchen',
    'Foodie\'s Paradise',
    'Taste of Home',
    'Urban Spoon',
    'Fresh & Tasty',
    'Flavor Junction',
    'The Hungry Spot'
  ];
  
  return genericLocations[Math.floor(Math.random() * genericLocations.length)];
};
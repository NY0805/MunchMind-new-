import jsPDF from 'jspdf';

interface UserData {
  name: string;
  email: string;
  dietaryPreferences: {
    dietType: string;
    allergies: string[];
    dislikes: string[];
  };
}

interface FavouriteItem {
  id: number;
  name: string;
  image: string;
  description: string;
  nutrition: string;
  mood: string;
  lastBite?: string;
  location?: string;
}

interface RecentMeal {
  id: number;
  name: string;
  image: string;
  date: string;
}

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export const exportUserDataToPDF = (
  userData: UserData,
  favourites: FavouriteItem[],
  recentMeals: RecentMeal[],
  kitchenInventory: InventoryItem[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;
    
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.height - 30) {
      doc.addPage();
      yPosition = 30;
    }
  };

  // Helper function to add section separator
  const addSeparator = () => {
    yPosition += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
  };

  // Title
  addText('MunchMind - My Food Data Export', 18, true);
  
  // Export Date with dd/mm/yyyy format
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  
  addText(`Exported Date: ${formattedDate}`, 10);
  addSeparator();

  // User Profile Section
  addText('USER PROFILE', 14, true);
  addText(`Name: ${userData.name || 'Not specified'}`);
  addText(`Email: ${userData.email || 'Not specified'}`);
  addText(`Diet Type: ${userData.dietaryPreferences.dietType || 'Not specified'}`);
  
  if (userData.dietaryPreferences.allergies.length > 0) {
    addText(`Allergies: ${userData.dietaryPreferences.allergies.join(', ')}`);
  } else {
    addText('Allergies: None specified');
  }
  
  if (userData.dietaryPreferences.dislikes.length > 0) {
    addText(`Dislikes: ${userData.dietaryPreferences.dislikes.join(', ')}`);
  } else {
    addText('Dislikes: None specified');
  }
  
  addSeparator();

  // Favourites Section
  addText('FAVOURITES', 14, true);
  if (favourites.length > 0) {
    favourites.forEach((fav, index) => {
      const lastBite = fav.lastBite || localStorage.getItem(`lastBite_${fav.id}`) || 'Never';
      const location = fav.location || localStorage.getItem(`location_${fav.id}`) || '-';
      addText(`${index + 1}. ${fav.name}`);
      addText(`   Description: ${fav.description}`);
      addText(`   Last Bite: ${lastBite}`);
      addText(`   Location: ${location}`);
      addText(`   Nutrition: ${fav.nutrition}`);
      yPosition += 5;
    });
  } else {
    addText('No favourites saved yet.');
  }
  
  addSeparator();

  // Recent Meals Section
  addText('RECENT MEALS', 14, true);
  if (recentMeals.length > 0) {
    recentMeals.forEach((meal, index) => {
      addText(`${index + 1}. ${meal.name} | ${meal.date}`);
    });
  } else {
    addText('No recent meals recorded.');
  }
  
  addSeparator();

  // Kitchen Inventory Section
  addText('KITCHEN INVENTORY', 14, true);
  if (kitchenInventory.length > 0) {
    kitchenInventory.forEach((item, index) => {
      addText(`${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`);
    });
  } else {
    addText('No items in kitchen inventory.');
  }

  addSeparator();

  // Additional Data Sections
  addText('RECIPES TRIED', 14, true);
  addText('Total recipes attempted: 128');
  addText('Successfully completed: 115');
  addText('Favorite cuisine: Mediterranean');
  addText('Most cooked dish: Pasta Primavera');
  
  addSeparator();

  addText('COUNTRIES EXPLORED', 14, true);
  addText('Total countries: 43');
  addText('Most explored: Italy, Thailand, Mexico, India, France');
  addText('Recent discoveries: Morocco, Peru, Lebanon');
  
  addSeparator();

  addText('NUTRITIONAL DNA', 14, true);
  addText('Protein intake: 78% of goal');
  addText('Fiber intake: 65% of goal');
  addText('Iron intake: 45% of goal');
  addText('Calcium intake: 82% of goal');
  addText('Vitamin C intake: 95% of goal');
  addText('Omega-3 intake: 30% of goal');
  
  addSeparator();

  addText('FOOD KARMA TRACKER', 14, true);
  addText('Current sustainability score: 71/100');
  addText('Water saved this month: 213 L');
  addText('Carbon footprint reduction: 15%');
  addText('Plant-based meals this week: 4');
  
  addSeparator();

  addText('CONNECTED DEVICES', 14, true);
  addText('Smart Refrigerator: Connected');
  addText('Mood Sensor Band: Connected');
  addText('Smart Body Weight Scale: Disconnected');

  // Footer
  yPosition += 20;
  if (yPosition > doc.internal.pageSize.height - 50) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by MunchMind Food Decision App', margin, yPosition);
  doc.text(`Total Pages: ${doc.getNumberOfPages()}`, margin, yPosition + 10);

  // Save the PDF
  doc.save('my_food_data.pdf');
};
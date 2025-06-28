import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';

const initialInventory = [
  { id: 1, name: 'Eggs', quantity: 6, unit: 'pcs' },
  { id: 2, name: 'Milk', quantity: 1, unit: 'L' },
  { id: 3, name: 'Chicken Breast', quantity: 300, unit: 'g' },
  { id: 4, name: 'Spinach', quantity: 1, unit: 'bunch' },
  { id: 5, name: 'Onions', quantity: 2, unit: 'pcs' }
];

const KitchenInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [inventoryLoaded, setInventoryLoaded] = useState(false);
  const [hasLoadedFromSupabase, setHasLoadedFromSupabase] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');
  const [newUnit, setNewUnit] = useState('pcs');
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const { theme } = useTheme();
  const { connectedDevices, user, isAuthenticated, isValidUser } = useUser();
  
  // Save to localStorage and Supabase whenever inventory changes
  useEffect(() => {
    if (!inventoryLoaded || !hasLoadedFromSupabase) return;
      
      // Avoid saving if inventory didn't actually change
      const lastSaved = localStorage.getItem('kitchenInventory');
      const hasChanged = lastSaved !== JSON.stringify(inventory);
      if (!hasChanged) return;
      localStorage.setItem('kitchenInventory', JSON.stringify(inventory));
    
    // Save to Supabase only for valid users
    if (isValidUser()) {
      saveInventoryToSupabase();
    } else if (user && user.is_guest) {
      // Show warning for guest users
      setShowSaveWarning(true);
      setTimeout(() => setShowSaveWarning(false), 3000);
    }
  }, [inventory, user, isAuthenticated, inventoryLoaded, hasLoadedFromSupabase]);

  const saveInventoryToSupabase = async () => {
    if (!isValidUser()) return;
    
    try {
      // Clear existing inventory for this user
      await supabase
        .from('inventory')
        .delete()
        .eq('user_id', user.id);

      // Insert new inventory items
      const inventoryData = inventory.map(item => ({
        user_id: user.id,
        ingredient: item.name,
        quantity: item.quantity,
        unit: item.unit
      }));

      if (inventoryData.length > 0) {
        await supabase
          .from('inventory')
          .insert(inventoryData);
      }
    } catch (error) {
      console.error('Failed to save inventory to Supabase:', error);
    }
  };

  // Load inventory from Supabase on component mount
  useEffect(() => {
    const loadInventoryFromSupabase = async () => {
      if (isValidUser()) {
        try {
          const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            const formattedInventory = data.map(item => ({
              id: Date.now() + Math.random(),
              name: item.ingredient,
              quantity: item.quantity,
              unit: item.unit
            }));
            setInventory(formattedInventory);
          }else {
            const saved = localStorage.getItem('kitchenInventory');
            setInventory(saved ? JSON.parse(saved) : initialInventory);
          }
        } catch (error) {
          console.error('Failed to load inventory from Supabase:', error);
          const saved = localStorage.getItem('kitchenInventory');
          setInventory(saved ? JSON.parse(saved) : initialInventory);
        }
      } else {
        const saved = localStorage.getItem('kitchenInventory');
        setInventory(saved ? JSON.parse(saved) : initialInventory);
      }
      setInventoryLoaded(true);
      setHasLoadedFromSupabase(true);
    };

    loadInventoryFromSupabase();
  }, [user, isAuthenticated]);
  
  // Auto-add ingredients from smart refrigerator
  useEffect(() => {
    const smartFridge = connectedDevices.find(device => device.name === 'Smart Refrigerator');
    if (smartFridge?.connected) {
      // Simulate auto-detected ingredients
      const autoDetectedItems = [
        { id: Date.now() + 1, name: 'Tomatoes', quantity: 4, unit: 'pcs' },
        { id: Date.now() + 2, name: 'Cheese', quantity: 200, unit: 'g' }
      ];
      
      setInventory(prev => {
        const newItems = autoDetectedItems.filter(newItem => 
          !prev.some(existingItem => existingItem.name.toLowerCase() === newItem.name.toLowerCase())
        );
        return [...prev, ...newItems];
      });
    }
  }, [connectedDevices]);
  
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const addItem = () => {
    if (newItem && newQuantity) {
      const newId = Math.max(0, ...inventory.map(item => item.id || 0)) + 1;
      setInventory([...inventory, {
        id: newId,
        name: newItem,
        quantity: parseInt(newQuantity) || 1,
        unit: newUnit
      }]);
      setNewItem('');
      setNewQuantity('1');
      setNewUnit('pcs');
    }
  };
  
  const removeItem = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-4">
        <h3 className={`font-semibold text-lg mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Kitchen Inventory
        </h3>

        {/* Save Warning for Guest Users */}
        {showSaveWarning && (
          <div className={`mb-4 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
          }`}>
            <p className="text-sm font-medium">Please log in to save your inventory data!</p>
          </div>
        )}
        
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 rounded text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              } border focus:outline-none`}
            />
            <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>
        </div>
        
        <div className="mb-4">
          {/* Fixed Add Item Layout - Responsive and contained */}
          <div className="space-y-3">
            {/* Mobile: Stack all fields vertically */}
            <div className="block lg:hidden space-y-2">
              <input
                type="text"
                placeholder="Add new item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className={`w-full px-3 py-2 rounded text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                } border focus:outline-none`}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className={`w-16 px-2 py-2 rounded text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } border focus:outline-none`}
                />
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } border focus:outline-none`}
                >
                  <option value="pcs">pcs</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="cup">cup</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                </select>
              </div>
              <button 
                onClick={addItem}
                className={`w-full py-2 rounded flex items-center justify-center gap-2 ${
                  theme === 'synesthesia'
                    ? 'bg-purple-500 hover:bg-purple-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white transition-colors`}
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>

            {/* Desktop: Compact horizontal layout that fits container */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-12 gap-1">
                <input
                  type="text"
                  placeholder="Add new item..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className={`col-span-6 px-2 py-2 rounded text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } border focus:outline-none`}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className={`col-span-2 px-1 py-2 rounded text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } border focus:outline-none`}
                />
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className={`col-span-3 px-1 py-2 rounded text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } border focus:outline-none`}
                >
                  <option value="pcs">pcs</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="cup">cup</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                </select>
                <button 
                  onClick={addItem}
                  className={`col-span-1 py-2 rounded flex items-center justify-center ${
                    theme === 'synesthesia'
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white transition-colors`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Notice with improved styling */}
            <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
              theme === 'synesthesia'
                ? 'bg-purple-100 text-purple-800'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-orange-50 text-orange-800'
            }`}>
              <Info size={12} className={
                theme === 'synesthesia' 
                  ? 'text-purple-600' 
                  : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-orange-600'
              } />
              <span>The default unit is 'pcs'.</span>
            </div>
          </div>
        </div>
        
        <div className={`max-h-64 overflow-y-auto ${
          theme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light'
        }`}>
          {filteredInventory.length === 0 ? (
            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No items found
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredInventory.map((item) => (
                <li 
                  key={item.id} 
                  className={`flex justify-between items-center p-2 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} truncate mr-2`}>
                    {item.name}
                  </span>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.quantity} {item.unit}
                    </span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className={`p-1 rounded-full ${
                        theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <X size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenInventory;
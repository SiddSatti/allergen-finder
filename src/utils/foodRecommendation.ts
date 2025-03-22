
import { FoodItem, FoodParameters, CsvData, ModelState } from '@/types';
import { RecommendationModel, getRecommendations } from './pythonModel';
import { parseTimeCategory } from './timeUtils';

// Process CSV data into FoodItem objects
export const processCSVData = (csvData: CsvData[]): FoodItem[] => {
  return csvData.map((item, index) => {
    // Parse embedding if available
    let embedding: number[] | undefined;
    if (item.Embedding) {
      try {
        // Clean the embedding string (remove brackets, extra spaces)
        const embeddingStr = item.Embedding.replace(/^\[|\]$/g, '').trim();
        embedding = embeddingStr.split(/\s+/).map(num => parseFloat(num.trim()));
      } catch (e) {
        console.error('Error parsing embedding:', e);
      }
    }
    
    // Parse allergens/restrictions
    let restrictions: string[] = [];
    try {
      if (item.Allergens) {
        // Handle different formats: ["Dairy", "Gluten"] or Dairy, Gluten
        if (item.Allergens.startsWith('[')) {
          restrictions = JSON.parse(item.Allergens.replace(/'/g, '"'));
        } else {
          restrictions = item.Allergens.split(',').map(r => r.trim());
        }
      }
    } catch (e) {
      console.error('Error parsing restrictions:', e);
    }
    
    // Parse ingredients
    let ingredients: string[] = [];
    try {
      if (item.Full_Ingredients) {
        // If the ingredient contains very long descriptions, split by commas
        if (item.Full_Ingredients.includes(',')) {
          ingredients = [item.Full_Ingredients]; // Keep the full ingredients as a single item
        } else {
          ingredients = [item.Full_Ingredients];
        }
      }
    } catch (e) {
      console.error('Error parsing ingredients:', e);
    }
    
    // Parse time category
    const timeCategory = parseTimeCategory(item.Time);
    
    return {
      id: index.toString(), // Generate an ID since it's not in the CSV
      name: item.Name,
      price: parseFloat(item.Price || '0'),
      distance: 0, // This will be calculated based on coordinates
      waitTime: parseInt(item.Time.match(/\d+/)?.[0] || '0'), // Extract number from time string
      ingredients,
      location: item.Location,
      subLocation: item.Sub_Location,
      restrictions,
      embedding,
      longitude: item.Longitude ? parseFloat(item.Longitude) : undefined,
      latitude: item.Latitude ? parseFloat(item.Latitude) : undefined,
      timeCategory,
      skipped: false,
      disliked: false
    };
  });
};

// Calculate distance between food items and user
export const calculateDistances = (foodItems: FoodItem[], userLat?: number | null, userLng?: number | null): FoodItem[] => {
  if (!userLat || !userLng) {
    return foodItems; // Return without calculating if user location not available
  }
  
  return foodItems.map(item => {
    let distance = 0;
    
    if (item.latitude && item.longitude) {
      // Haversine formula to calculate distance
      const R = 3958.8; // Radius of the Earth in miles
      const dLat = (item.latitude - userLat) * Math.PI / 180;
      const dLon = (item.longitude - userLng) * Math.PI / 180;
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(item.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
        
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance = R * c;
    }
    
    return {
      ...item,
      distance
    };
  });
};

// Legacy recommendation algorithm (simplified)
export const recommendFoodsSimple = (foodItems: FoodItem[], parameters: FoodParameters): FoodItem[] => {
  // Filter by dietary restrictions first
  let filteredItems = foodItems.filter(food => {
    // If the user has no restrictions, don't filter
    if (parameters.dietaryRestrictions.length === 0) return true;
    
    // Check if any of the user's restrictions match the food's restrictions
    return !parameters.dietaryRestrictions.some(restriction => 
      food.restrictions.includes(restriction)
    );
  });
  
  // Filter by time category if available
  if (parameters.timeCategory) {
    const timeFilteredItems = filteredItems.filter(item => 
      item.timeCategory === parameters.timeCategory || item.timeCategory === 'Other'
    );
    
    // Only apply time filtering if we still have items left
    if (timeFilteredItems.length > 0) {
      filteredItems = timeFilteredItems;
    }
  }
  
  // Sort by distance if available
  const sortedFoods = filteredItems.sort((a, b) => {
    return a.distance - b.distance;
  });
  
  return sortedFoods;
};

// Main recommendation function using the ML model
export const recommendFoods = async (
  foodItems: FoodItem[], 
  parameters: FoodParameters, 
  userChoice: number = -1,
  modelState: ModelState | null = null
): Promise<FoodItem[]> => {
  try {
    // Filter out skipped and disliked items if we have a model state
    let filteredItems = [...foodItems];
    
    if (modelState && (modelState.skippedItems?.length > 0 || modelState.dislikedItems?.length > 0)) {
      filteredItems = foodItems.filter(item => {
        return !modelState.skippedItems?.includes(item.id) && !modelState.dislikedItems?.includes(item.id);
      });
    }
    
    // Filter by time category if available
    if (parameters.timeCategory) {
      const timeFilteredItems = filteredItems.filter(item => 
        item.timeCategory === parameters.timeCategory || item.timeCategory === 'Other'
      );
      
      // Only apply time filtering if we still have items left
      if (timeFilteredItems.length > 0) {
        filteredItems = timeFilteredItems;
      }
    }
    
    // Calculate distances
    if (parameters.latitude && parameters.longitude) {
      filteredItems = calculateDistances(filteredItems, parameters.latitude, parameters.longitude);
    }
    
    // If we have no items, return empty array
    if (filteredItems.length === 0) {
      return [];
    }
    
    // If we have a stored model, try to use it
    let model: RecommendationModel | null = null;
    if (modelState && modelState.model) {
      // In a real implementation, we would restore the model from the state
      model = modelState.model;
    } else {
      model = new RecommendationModel(parameters.dietaryRestrictions);
    }
    
    // Get recommendations using the model
    const { model: updatedModel, recommendations } = getRecommendations(
      filteredItems,
      parameters,
      userChoice,
      model
    );
    
    // Update skipped/disliked items based on user choice
    let skippedItems = modelState?.skippedItems || [];
    let dislikedItems = modelState?.dislikedItems || [];
    
    if (userChoice === 1 && recommendations.length > 0) {
      // User shuffled (skipped) the item
      skippedItems = [...skippedItems, recommendations[0].id];
    } else if (userChoice === 0 && recommendations.length > 0) {
      // User disliked the item
      dislikedItems = [...dislikedItems, recommendations[0].id];
    }
    
    // Store the updated model state
    const updatedModelState: ModelState = {
      model: updatedModel,
      iteration: updatedModel.iteration,
      userPreferences: updatedModel.ideal,
      skippedItems,
      dislikedItems
    };

    localStorage.setItem('modelState', JSON.stringify(updatedModelState));
    
    // Return recommendations
    return recommendations;
  } catch (error) {
    console.error('Error in recommendation algorithm:', error);
    
    // Fallback to simple algorithm if ML model fails
    return recommendFoodsSimple(foodItems, parameters);
  }
};

// This function would interface with the Python model in a real application
export const runPythonModel = async (foodItems: FoodItem[], parameters: FoodParameters): Promise<FoodItem[]> => {
  // In a production app, this would make an API call to a Python backend
  // For now, we'll use our client-side implementation
  return recommendFoods(foodItems, parameters);
};

// Mock data for testing
export const getTestData = (): FoodItem[] => {
  return [
    {
      id: '1',
      name: 'Ono Ahi Tuna Poke Bowl',
      price: 9.99,
      distance: 0.4,
      waitTime: 15,
      ingredients: ['Tuna, Rice, Seaweed, Soy Sauce, Sesame Oil, Green Onions, Cucumber, Avocado, Carrot'],
      location: 'HUB-Robeson Center',
      restrictions: ['Fish', 'Soy', 'Gluten'],
      embedding: Array(100).fill(0).map(() => Math.random()), // Generate random embedding for demo
      longitude: -77.8592,
      latitude: 40.7982,
      timeCategory: 'Lunch'
    },
    {
      id: '2',
      name: 'Veggie Burrito Bowl',
      price: 8.99,
      distance: 0.3,
      waitTime: 10,
      ingredients: ['Rice, Black Beans, Corn, Tomatoes, Lettuce, Guacamole, Salsa, Cilantro, Lime'],
      location: 'Pollock Commons',
      restrictions: [],
      embedding: Array(100).fill(0).map(() => Math.random()),
      longitude: -77.8632,
      latitude: 40.8006,
      timeCategory: 'Lunch'
    },
    {
      id: '3',
      name: 'Cheese Pizza Slice',
      price: 3.99,
      distance: 0.2,
      waitTime: 5,
      ingredients: ['Dough, Tomato Sauce, Mozzarella Cheese, Oregano, Basil'],
      location: 'West Commons',
      restrictions: ['Dairy', 'Gluten'],
      embedding: Array(100).fill(0).map(() => Math.random()),
      longitude: -77.8702,
      latitude: 40.7942,
      timeCategory: 'Dinner'
    },
    {
      id: '4',
      name: 'Chicken Caesar Wrap',
      price: 7.99,
      distance: 0.5,
      waitTime: 8,
      ingredients: ['Grilled Chicken, Romaine Lettuce, Caesar Dressing, Parmesan Cheese, Flour Tortilla, Croutons'],
      location: 'East Food District',
      restrictions: ['Dairy', 'Gluten', 'Egg'],
      embedding: Array(100).fill(0).map(() => Math.random()),
      longitude: -77.8552,
      latitude: 40.7992,
      timeCategory: 'Breakfast'
    }
  ];
};

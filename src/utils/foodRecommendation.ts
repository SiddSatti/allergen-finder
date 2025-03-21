
import { FoodItem, FoodParameters, CsvData, ModelState } from '@/types';
import { RecommendationModel, getRecommendations } from './pythonModel';

// Process CSV data into FoodItem objects
export const processCSVData = (csvData: CsvData[]): FoodItem[] => {
  return csvData.map(item => {
    // Parse embedding if available
    let embedding: number[] | undefined;
    if (item.embedding) {
      try {
        embedding = item.embedding.split(',').map(num => parseFloat(num.trim()));
      } catch (e) {
        console.error('Error parsing embedding:', e);
      }
    }
    
    return {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      distance: parseFloat(item.distance),
      waitTime: parseFloat(item.waitTime),
      ingredients: item.ingredients.split(',').map(i => i.trim()),
      location: item.location,
      restrictions: item.restrictions.split(',').map(r => r.trim()),
      embedding: embedding,
      longitude: item.longitude ? parseFloat(item.longitude) : undefined,
      latitude: item.latitude ? parseFloat(item.latitude) : undefined
    };
  });
};

// Legacy recommendation algorithm (simplified)
export const recommendFoodsSimple = (foodItems: FoodItem[], parameters: FoodParameters): FoodItem[] => {
  // Filter by dietary restrictions first
  const filteredByRestrictions = foodItems.filter(food => {
    // If the user has no restrictions, don't filter
    if (parameters.dietaryRestrictions.length === 0) return true;
    
    // Check if any of the user's restrictions match the food's restrictions
    return !parameters.dietaryRestrictions.some(restriction => 
      food.restrictions.includes(restriction)
    );
  });
  
  // Filter by budget, distance, and wait time
  const filteredByParameters = filteredByRestrictions.filter(food => {
    return (
      (parameters.budget === 0 || food.price <= parameters.budget) &&
      (parameters.distance === 0 || food.distance <= parameters.distance) &&
      (parameters.waitTimeMax === 0 || food.waitTime <= parameters.waitTimeMax)
    );
  });
  
  // Sort by a combination of factors
  // Lower price, shorter distance, and shorter wait time are better
  const sortedFoods = filteredByParameters.sort((a, b) => {
    const aScore = (a.price * 0.4) + (a.distance * 0.3) + (a.waitTime * 0.3);
    const bScore = (b.price * 0.4) + (b.distance * 0.3) + (b.waitTime * 0.3);
    return aScore - bScore;
  });
  
  return sortedFoods;
};

// Main recommendation function using the ML model
export const recommendFoods = async (
  foodItems: FoodItem[], 
  parameters: FoodParameters, 
  userChoice: number = -1
): Promise<FoodItem[]> => {
  try {
    // Get the stored model state from localStorage if available
    let modelState: ModelState | null = null;
    const storedState = localStorage.getItem('modelState');
    
    if (storedState) {
      try {
        modelState = JSON.parse(storedState);
      } catch (e) {
        console.error('Error parsing stored model state:', e);
      }
    }
    
    // Apply basic filters first (budget, distance, waitTime)
    const filteredItems = foodItems.filter(food => {
      return (
        (parameters.budget === 0 || food.price <= parameters.budget) &&
        (parameters.distance === 0 || food.distance <= parameters.distance) &&
        (parameters.waitTimeMax === 0 || food.waitTime <= parameters.waitTimeMax)
      );
    });
    
    // If we have no items after basic filtering, return empty array
    if (filteredItems.length === 0) {
      return [];
    }
    
    // If we have a stored model, try to use it
    let model: RecommendationModel | null = null;
    if (modelState) {
      // In a real implementation, we would restore the model from the state
      // Since we can't directly serialize/deserialize class instances easily,
      // we'll just create a new model and pretend it's restored
      model = new RecommendationModel(parameters.dietaryRestrictions);
    }
    
    // Get recommendations using the model
    const { model: updatedModel, recommendations } = getRecommendations(
      filteredItems,
      parameters,
      userChoice,
      model
    );
    
    // Store the updated model state
    // In a real implementation, we would properly serialize the model
    localStorage.setItem('modelState', JSON.stringify({
      model: updatedModel,
      iteration: updatedModel.iteration,
      userPreferences: updatedModel.ideal
    }));
    
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
      ingredients: ['Tuna', 'Rice', 'Seaweed', 'Soy Sauce', 'Sesame Oil', 'Green Onions'],
      location: 'HUB-Robeson Center',
      restrictions: ['Fish', 'Soy', 'Gluten'],
      embedding: Array(100).fill(0).map(() => Math.random()), // Generate random embedding for demo
      longitude: -77.8592,
      latitude: 40.7982
    },
    {
      id: '2',
      name: 'Veggie Burrito Bowl',
      price: 8.99,
      distance: 0.3,
      waitTime: 10,
      ingredients: ['Rice', 'Black Beans', 'Corn', 'Tomatoes', 'Lettuce', 'Guacamole', 'Salsa'],
      location: 'Pollock Commons',
      restrictions: [],
      embedding: Array(100).fill(0).map(() => Math.random()),
      longitude: -77.8632,
      latitude: 40.8006
    },
    {
      id: '3',
      name: 'Cheese Pizza Slice',
      price: 3.99,
      distance: 0.2,
      waitTime: 5,
      ingredients: ['Dough', 'Tomato Sauce', 'Cheese'],
      location: 'West Commons',
      restrictions: ['Dairy', 'Gluten'],
      embedding: Array(100).fill(0).map(() => Math.random()),
      longitude: -77.8702,
      latitude: 40.7942
    },
    {
      id: '4',
      name: 'Chicken Caesar Wrap',
      price: 7.99,
      distance: 0.5,
      waitTime: 8,
      ingredients: ['Grilled Chicken', 'Romaine Lettuce', 'Caesar Dressing', 'Parmesan Cheese', 'Flour Tortilla'],
      location: 'East Food District',
      restrictions: ['Dairy', 'Gluten', 'Egg'],
      embedding: Array(100).fill(0).map(() => Math.random()),
      longitude: -77.8552,
      latitude: 40.7992
    }
  ];
};

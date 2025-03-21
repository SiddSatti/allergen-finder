
import { FoodItem, FoodParameters, CsvData } from '@/types';

// This is a simplified version of the food recommendation algorithm
// In a real application, you would use a more sophisticated algorithm
// and possibly integrate with a Python backend for the machine learning model
export const processCSVData = (csvData: CsvData[]): FoodItem[] => {
  return csvData.map(item => ({
    id: item.id,
    name: item.name,
    price: parseFloat(item.price),
    distance: parseFloat(item.distance),
    waitTime: parseFloat(item.waitTime),
    ingredients: item.ingredients.split(',').map(i => i.trim()),
    location: item.location,
    restrictions: item.restrictions.split(',').map(r => r.trim()),
  }));
};

export const recommendFoods = (foodItems: FoodItem[], parameters: FoodParameters): FoodItem[] => {
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

// This function would interface with the Python model in a real application
export const runPythonModel = async (foodItems: FoodItem[], parameters: FoodParameters): Promise<FoodItem[]> => {
  // In a real application, this would send a request to a Python backend
  // For now, we'll just use our simplified algorithm
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
      restrictions: ['Fish', 'Soy', 'Gluten']
    },
    {
      id: '2',
      name: 'Veggie Burrito Bowl',
      price: 8.99,
      distance: 0.3,
      waitTime: 10,
      ingredients: ['Rice', 'Black Beans', 'Corn', 'Tomatoes', 'Lettuce', 'Guacamole', 'Salsa'],
      location: 'Pollock Commons',
      restrictions: []
    },
    {
      id: '3',
      name: 'Cheese Pizza Slice',
      price: 3.99,
      distance: 0.2,
      waitTime: 5,
      ingredients: ['Dough', 'Tomato Sauce', 'Cheese'],
      location: 'West Commons',
      restrictions: ['Dairy', 'Gluten']
    },
    {
      id: '4',
      name: 'Chicken Caesar Wrap',
      price: 7.99,
      distance: 0.5,
      waitTime: 8,
      ingredients: ['Grilled Chicken', 'Romaine Lettuce', 'Caesar Dressing', 'Parmesan Cheese', 'Flour Tortilla'],
      location: 'East Food District',
      restrictions: ['Dairy', 'Gluten', 'Egg']
    }
  ];
};

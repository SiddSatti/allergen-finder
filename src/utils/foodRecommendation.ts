
import { FoodItem, CsvData } from '@/types';
import { parseTimeCategory } from './timeUtils';
import { foodCsvData } from '@/data/foodData';

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

// Get test data for food details
export const getTestData = (): FoodItem[] => {
  return processCSVData(foodCsvData);
};

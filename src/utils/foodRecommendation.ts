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
        const embeddingStr = item.Embedding.toString().replace(/^\[|\]$/g, '').trim();
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
        if (item.Allergens.toString().startsWith('[')) {
          restrictions = JSON.parse(item.Allergens.toString().replace(/'/g, '"'));
        } else {
          restrictions = item.Allergens.toString().split(',').map(r => r.trim());
        }
      }
    } catch (e) {
      console.error('Error parsing restrictions:', e);
    }
    
    // Parse ingredients
    let ingredients: string[] = [];
    try {
      if (item.Full_Ingredients) {
        const ingredientsText = item.Full_Ingredients.toString();
        // If the ingredient contains very long descriptions, keep as single item
        if (ingredientsText.length > 0) {
          // Split by comma if it looks like a list
          if (ingredientsText.includes(',')) {
            ingredients = ingredientsText.split(',').map(ing => ing.trim());
          } else {
            ingredients = [ingredientsText];
          }
        }
      }
    } catch (e) {
      console.error('Error parsing ingredients:', e);
    }
    
    // Parse time category
    const timeCategory = parseTimeCategory(item.Time.toString());
    
    // Parse longitude and latitude
    const longitude = typeof item.Longitude === 'string' ? parseFloat(item.Longitude) : item.Longitude;
    const latitude = typeof item.Latitude === 'string' ? parseFloat(item.Latitude) : item.Latitude;
    
    // Parse price
    const price = typeof item.Price === 'string' ? parseFloat(item.Price || '0') : (item.Price || 0);
    
    return {
      id: index.toString(), // Generate an ID since it's not in the CSV
      name: item.Name.toString(),
      price,
      distance: 0, // This will be calculated based on coordinates
      waitTime: parseInt(item.Time.toString().match(/\d+/)?.[0] || '0'), // Extract number from time string
      ingredients,
      location: item.Location.toString(),
      subLocation: item.Sub_Location ? item.Sub_Location.toString() : undefined,
      restrictions,
      embedding,
      longitude,
      latitude,
      timeCategory,
      skipped: false,
      disliked: false
    };
  });
};

// Calculate distance between food items and user
export const calculateDistances = (foodItems: FoodItem[], userLat: number, userLng: number): FoodItem[] => {
  // Return foodItems with calculated distances
  return foodItems.map(item => {
    let distance = 0;
    
    if (item.latitude !== undefined && item.longitude !== undefined) {
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
      
      // In case of errors or NaN, ensure we return 0
      if (isNaN(distance)) {
        distance = 0;
        console.warn(`Invalid distance calculated for ${item.name}`, { lat: item.latitude, lng: item.longitude });
      }
    }
    
    return {
      ...item,
      distance: distance
    };
  });
};

// Get test data for food details
export const getTestData = (): FoodItem[] => {
  const data = processCSVData(foodCsvData);
  return calculateDistances(data, 40.7128, -74.0060); // Use NYC coordinates as default for testing
};

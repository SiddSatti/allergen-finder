
export interface DietaryRestriction {
  id: string;
  name: string;
  selected: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  distance: number;
  waitTime: number;
  ingredients: string[];
  location: string;
  subLocation?: string;
  image?: string;
  restrictions: string[];
  embedding?: number[]; // Embedding vector for ML model
  longitude?: number;   // Longitude for location
  latitude?: number;    // Latitude for location
  timeCategory?: string; // Breakfast, Lunch, or Dinner
  skipped?: boolean;    // Flag to indicate if item was skipped
  disliked?: boolean;   // Flag to indicate if item was disliked
}

export interface FoodParameters {
  dietaryRestrictions: string[];
  longitude?: number;  // User's longitude
  latitude?: number;   // User's latitude
  timeCategory?: string; // Current time category (breakfast, lunch, dinner)
}

export interface CsvData {
  Name: string;
  Location: string;
  Sub_Location: string;
  Time: string;
  Longitude: string;
  Latitude: string;
  Allergens: string;
  Full_Ingredients: string;
  Embedding: string;
  Price: string;
}

export interface ModelChoice {
  choice: number;  // 0 = dislike, 1 = shuffle, 2 = like
}

export interface ModelState {
  model: any;      // Store the recommendation model instance
  iteration: number;
  userPreferences: number[];
  skippedItems: string[]; // IDs of skipped items
  dislikedItems: string[]; // IDs of disliked items
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  dietaryRestrictions: DietaryRestriction[];
  modelState?: ModelState;
}

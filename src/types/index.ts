
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
}

export interface FoodParameters {
  dietaryRestrictions: string[];
  longitude?: number;  // User's longitude
  latitude?: number;   // User's latitude
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
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  dietaryRestrictions: DietaryRestriction[];
  modelState?: ModelState;
}


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
  image?: string;
  restrictions: string[];
  embedding?: number[]; // Optional embedding vector for ML model
  longitude?: number;   // Optional longitude for location
  latitude?: number;    // Optional latitude for location
}

export interface FoodParameters {
  budget: number;
  distance: number;
  waitTimeMax: number;
  dietaryRestrictions: string[];
  longitude?: number;  // User's longitude
  latitude?: number;   // User's latitude
}

export interface CsvData {
  id: string;
  name: string;
  price: string;
  distance: string;
  waitTime: string;
  ingredients: string;
  location: string;
  restrictions: string;
  embedding?: string;    // Optional embedding string (to be parsed)
  longitude?: string;    // Optional longitude string
  latitude?: string;     // Optional latitude string
}

export interface ModelChoice {
  choice: number;  // 0 = dislike, 1 = shuffle, 2 = like
}

export interface ModelState {
  model: any;      // Store the recommendation model instance
  iteration: number;
  userPreferences: number[];
}

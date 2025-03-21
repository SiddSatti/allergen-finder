
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
}

export interface FoodParameters {
  budget: number;
  distance: number;
  waitTimeMax: number;
  dietaryRestrictions: string[];
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
}

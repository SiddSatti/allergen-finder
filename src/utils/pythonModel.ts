import { FoodItem, FoodParameters } from '@/types';

// This is a TypeScript adaptation of the Python r_model class
export class RecommendationModel {
  public iteration: number;
  public ideal: number[];
  private allergies: string[];
  private food: FoodItem[];
  private longitude: number;
  private latitude: number;
  private scoreData: {name: string, score: number}[];

  constructor(allergies: string[]) {
    // Start with iteration 0
    this.iteration = 0;
    
    // Vector representing user's taste (initialized with small values)
    this.ideal = Array(100).fill(0.01);
    
    // Store allergies/dietary restrictions
    this.allergies = allergies;
    
    // Initialize empty arrays
    this.food = [];
    this.scoreData = [];
    this.longitude = 0;
    this.latitude = 0;
  }

  // Load food items and filter out those with user's allergies
  loadFood(foodItems: FoodItem[]): void {
    this.food = foodItems.filter(item => {
      // Check if the item contains any of the user's allergies
      return !item.restrictions.some(restriction => 
        this.allergies.includes(restriction)
      );
    });
  }

  // Set user's location
  loadLocation(longitude: number, latitude: number): void {
    this.longitude = longitude;
    this.latitude = latitude;
  }

  // Calculate similarity between two vectors (cosine similarity)
  private cosineSimilarity(a: number[], b: number[]): number {
    // Implementation of cosine similarity
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Calculate distance between two coordinates (Haversine formula)
  private haversineDistance(lon1: number, lat1: number, lon2: number, lat2: number): number {
    // Implementation of the haversine formula
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }

  // Calculate scores for all food items
  getScores(): void {
    this.scoreData = [];
    
    for (const item of this.food) {
      // Use the embedding from the food item if available, otherwise create a fallback
      const embedding = item.embedding || Array(100).fill(0).map(() => Math.random());
      
      // Calculate cosine similarity score
      const cosScore = this.cosineSimilarity(this.ideal, embedding);
      
      // Calculate distance score using coordinates if available
      let distScore = 0;
      if (item.longitude && item.latitude && this.longitude && this.latitude) {
        distScore = this.haversineDistance(this.longitude, this.latitude, item.longitude, item.latitude);
      } else {
        // Fallback to the distance field
        distScore = item.distance;
      }
      
      // Final score calculation (similar to the Python model)
      const score = (cosScore * 5) - distScore;
      
      this.scoreData.push({
        name: item.name,
        score: score
      });
    }
  }

  // Get the food item with the highest score
  getMax(): FoodItem {
    if (this.scoreData.length === 0) {
      throw new Error("No scores calculated yet. Call getScores() first.");
    }
    
    // Find the item with the highest score
    const maxScore = Math.max(...this.scoreData.map(item => item.score));
    const maxItem = this.scoreData.find(item => item.score === maxScore);
    
    if (!maxItem) {
      throw new Error("Failed to find max score item");
    }
    
    // Find the corresponding food item
    const foodItem = this.food.find(item => item.name === maxItem.name);
    
    if (!foodItem) {
      throw new Error("Failed to find food item for max score");
    }
    
    return foodItem;
  }

  // Process user's choice and update the model
  iterate(choice: number): void {
    // Get the current max food item
    const maxFood = this.getMax();
    
    // Use the embedding from the food item, or create a fallback
    const embedding = maxFood.embedding || Array(100).fill(0).map(() => Math.random());
    
    if (choice === 0) {
      // User clicked X (dislike)
      // Update ideal vector to be less like this food
      this.ideal = this.ideal.map((val, idx) => val - (embedding[idx % embedding.length] / 10));
    } 
    else if (choice === 1) {
      // User clicked shuffle
      // Just increment iteration
    } 
    else if (choice === 2) {
      // User liked the food
      // Update ideal vector to be more like this food
      this.ideal = this.ideal.map((val, idx) => val + (embedding[idx % embedding.length] / 10));
    }
    
    // Increment iteration counter
    this.iteration += 1;
    
    // Every 10 iterations, normalize the ideal vector
    if ((this.iteration % 10) === 0) {
      const mean = this.ideal.reduce((sum, val) => sum + val, 0) / this.ideal.length;
      this.ideal = this.ideal.map(val => val - mean);
    }
    
    // Recalculate scores after updating the model
    this.getScores();
  }

  // Get top N recommendations
  getTopRecommendations(n: number = 10): FoodItem[] {
    if (this.scoreData.length === 0) {
      this.getScores();
    }
    
    // Sort items by score (descending)
    const sortedScores = [...this.scoreData].sort((a, b) => b.score - a.score);
    
    // Get top N items
    const topN = sortedScores.slice(0, n);
    
    // Return corresponding food items
    return topN
      .map(score => this.food.find(food => food.name === score.name))
      .filter((item): item is FoodItem => item !== undefined);
  }
}

// Function to initialize and use the model
export const getRecommendations = (
  foodItems: FoodItem[], 
  parameters: FoodParameters,
  userChoice: number = -1,
  previousModel: RecommendationModel | null = null
): { model: RecommendationModel, recommendations: FoodItem[] } => {
  // If we have a previous model and a valid choice, use it
  // Otherwise create a new model
  const model = previousModel && userChoice >= 0 
    ? previousModel 
    : new RecommendationModel(parameters.dietaryRestrictions);
  
  // Load food data
  model.loadFood(foodItems);
  
  // If this is a new iteration with a choice, process it
  if (previousModel && userChoice >= 0) {
    model.iterate(userChoice);
  } else {
    // Otherwise just calculate scores
    model.getScores();
  }
  
  // Get top recommendations
  const recommendations = model.getTopRecommendations(10);
  
  return { model, recommendations };
};

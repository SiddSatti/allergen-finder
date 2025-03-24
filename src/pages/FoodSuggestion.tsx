
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IngredientsModal from '@/components/IngredientsModal';
import SuggestionLoading from '@/components/SuggestionLoading';
import NoSuggestionsFound from '@/components/NoSuggestionsFound';
import FoodSuggestionCard from '@/components/FoodSuggestionCard';
import FeedbackButtons from '@/components/FeedbackButtons';
import { FoodItem, FoodParameters, DietaryRestriction, ModelState } from '@/types';
import { processCSVData, calculateDistances } from '@/utils/foodRecommendation';
import { getCurrentTimeCategory } from '@/utils/timeUtils';
import useUserLocation from '@/hooks/useUserLocation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { foodCsvData } from '@/data/foodData';

const FoodSuggestion = () => {
  const navigate = useNavigate();
  const [currentSuggestion, setCurrentSuggestion] = useState<FoodItem | null>(null);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userLocation = useUserLocation();
  const [allSuggestions, setAllSuggestions] = useState<FoodItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendationModel, setRecommendationModel] = useState<any>(null);
  const [seenItems, setSeenItems] = useState<Set<string>>(new Set());
  
  const initializeRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Process the embedded CSV data
      const foodItems = processCSVData(foodCsvData);
      
      // Get dietary restrictions from local storage
      const savedRestrictions = JSON.parse(localStorage.getItem('dietaryRestrictions') || '[]');
      const selectedRestrictions = savedRestrictions
        .filter((restriction: DietaryRestriction) => restriction.selected)
        .map((restriction: DietaryRestriction) => restriction.name);
      
      // Get parameters from local storage (for max distance)
      const params = JSON.parse(localStorage.getItem('foodParameters') || '{}');
      const maxDistance = params.distance || Infinity;
      
      // Filter by dietary restrictions
      let filteredItems = foodItems.filter(food => {
        // Check if the item contains any of the user's restrictions
        return !food.restrictions.some(restriction => 
          selectedRestrictions.includes(restriction)
        );
      });
      
      // Calculate distances if we have user location
      if (userLocation.latitude && userLocation.longitude) {
        filteredItems = calculateDistances(filteredItems, userLocation.latitude, userLocation.longitude);
        
        // Filter by maximum distance if specified
        if (maxDistance !== Infinity) {
          filteredItems = filteredItems.filter(food => food.distance <= maxDistance);
        }
      }
      
      // Check if we have any valid items
      if (filteredItems.length === 0) {
        toast.error('No food matches your criteria. Try adjusting your preferences.');
        navigate('/food-parameters');
        return;
      }
      
      // Get or initialize model from localStorage
      let model = null;
      const storedModelState = localStorage.getItem('modelState');
      if (storedModelState) {
        try {
          const modelState = JSON.parse(storedModelState);
          model = modelState.model;
          // Add seen items to our set
          if (modelState.seenItems && Array.isArray(modelState.seenItems)) {
            setSeenItems(new Set(modelState.seenItems));
          }
        } catch (e) {
          console.error('Error parsing stored model state:', e);
        }
      }
      
      // Initialize model if needed
      if (!model) {
        // Initialize with random values
        model = {
          ideal: Array(100).fill(0).map(() => Math.random() * 0.1 - 0.05) // Small random values
        };
      }
      
      // Calculate scores for each food item
      const scoredItems = filteredItems.map(item => {
        const embedding = item.embedding || Array(100).fill(0);
        
        // Calculate cosine similarity
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < Math.min(model.ideal.length, embedding.length); i++) {
          dotProduct += model.ideal[i] * embedding[i];
          normA += model.ideal[i] * model.ideal[i];
          normB += embedding[i] * embedding[i];
        }
        
        const similarity = normA && normB ? dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
        
        // Final score (personalization factor * 5 - distance)
        const score = (similarity * 5) - (item.distance || 0);
        
        return {
          ...item,
          score
        };
      });
      
      // Sort by score (descending)
      const sortedItems = scoredItems.sort((a, b) => b.score - a.score);
      
      // Filter out already seen items
      const unseenItems = sortedItems.filter(item => !seenItems.has(item.id));
      
      if (unseenItems.length === 0) {
        // If all items have been seen, reset the seen items
        setSeenItems(new Set());
        setAllSuggestions(sortedItems);
      } else {
        setAllSuggestions(unseenItems);
      }
      
      setRecommendationModel(model);
      setCurrentIndex(0);
      
    } catch (error) {
      console.error('Error generating food suggestions:', error);
      toast.error('Failed to generate food suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Set current suggestion based on current index
    if (allSuggestions.length > 0 && currentIndex < allSuggestions.length) {
      setCurrentSuggestion(allSuggestions[currentIndex]);
      
      // Mark this item as seen
      if (currentSuggestion) {
        setSeenItems(prev => {
          const newSet = new Set(prev);
          newSet.add(currentSuggestion.id);
          return newSet;
        });
      }
    } else if (allSuggestions.length > 0) {
      // We've reached the end of suggestions, start over
      setCurrentIndex(0);
      setCurrentSuggestion(allSuggestions[0]);
    }
  }, [allSuggestions, currentIndex]);
  
  useEffect(() => {
    // Initialize recommendations when user location is available
    if (!userLocation.loading) {
      initializeRecommendations();
    }
  }, [userLocation.loading, navigate]);
  
  const updateModelWithFeedback = (choice: 0 | 1 | 2) => {
    if (!currentSuggestion || !recommendationModel) return;

    const embedding = currentSuggestion.embedding || Array(100).fill(0);
    const model = { ...recommendationModel };

    // Store the original vector for calculating its magnitude
    const originalIdeal = [...model.ideal];

    // Update the ideal vector based on user feedback
    if (choice === 0) { // Dislike
        // Move away from this food's embedding
        model.ideal = model.ideal.map((val: number, idx: number) => {
            if (idx < embedding.length) {
                return val - (embedding[idx]);
            }
            return val;
        });
    } else if (choice === 2) { // Like
        // Move toward this food's embedding
        model.ideal = model.ideal.map((val: number, idx: number) => {
            if (idx < embedding.length) {
                return val + (embedding[idx]);
            }
            return val;
        });
    }

    // Mean center the vector
    const sum = model.ideal.reduce((acc: number, val: number) => acc + val, 0);
    const avg = sum / model.ideal.length;
    model.ideal = model.ideal.map((val: number) => val - avg);

    // Restore the original magnitude
    const centeredMagnitude = Math.sqrt(model.ideal.reduce((sum, val) => sum + val * val, 0));
    const originalMagnitude = Math.sqrt(originalIdeal.reduce((sum, val) => sum + val * val, 0));

    if (centeredMagnitude !== 0) {
        const scalingFactor = originalMagnitude / centeredMagnitude;
        model.ideal = model.ideal.map(val => val * scalingFactor);
    }
   // Update model state
    setRecommendationModel(model);

    // Save to localStorage
    localStorage.setItem('modelState', JSON.stringify({
        model,
        seenItems: Array.from(seenItems)
    }));
};

  
  const handleLike = () => {
    // User likes this food
    updateModelWithFeedback(2);
    
    // Navigate to food details
    if (currentSuggestion) {
      navigate(`/food-details/${currentSuggestion.id}`);
    }
  };

  const handleDislike = () => {
    // User dislikes this food
    updateModelWithFeedback(0);
    
    // Move to next suggestion
    setCurrentIndex(prev => prev + 1);
  };

  const handleShuffle = () => {
    // Just move to next suggestion without updating model
    setCurrentIndex(prev => prev + 1);
  };
  
  // Show loading state while getting user location
  if (userLocation.loading || isLoading) {
    return <SuggestionLoading />;
  }
  
  if (!currentSuggestion) {
    return <NoSuggestionsFound />;
  }
  
  return (
    <div className="bytewise-container bytewise-page-transition">
      <Header 
        title={currentSuggestion.name} 
        showBackButton={true} 
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <FoodSuggestionCard 
          food={currentSuggestion}
          onViewIngredients={() => setIsIngredientsOpen(true)}
        />
        
        <FeedbackButtons 
          onLike={handleLike}
          onDislike={handleDislike}
          onShuffle={handleShuffle}
        />
      </motion.div>
      
      <IngredientsModal
        isOpen={isIngredientsOpen}
        onClose={() => setIsIngredientsOpen(false)}
        ingredients={currentSuggestion.ingredients}
        foodName={currentSuggestion.name}
      />
    </div>
  );
};

export default FoodSuggestion;

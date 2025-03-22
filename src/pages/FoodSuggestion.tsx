
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IngredientsModal from '@/components/IngredientsModal';
import SuggestionLoading from '@/components/SuggestionLoading';
import NoSuggestionsFound from '@/components/NoSuggestionsFound';
import FoodSuggestionCard from '@/components/FoodSuggestionCard';
import FeedbackButtons from '@/components/FeedbackButtons';
import { FoodItem, FoodParameters, DietaryRestriction } from '@/types';
import { recommendFoods, getTestData } from '@/utils/foodRecommendation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const FoodSuggestion = () => {
  const navigate = useNavigate();
  const [currentSuggestion, setCurrentSuggestion] = useState<FoodItem | null>(null);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate a new food suggestion based on parameters and current state
  const generateSuggestion = async (choice: number = -1) => {
    setIsLoading(true);
    
    try {
      // Use test data since we're removing the CSV uploader
      const foodItems = getTestData();
      
      // Get parameters from local storage
      const params = JSON.parse(localStorage.getItem('foodParameters') || '{}');
      
      // Get dietary restrictions from local storage
      const savedRestrictions = JSON.parse(localStorage.getItem('dietaryRestrictions') || '[]');
      const selectedRestrictions = savedRestrictions
        .filter((restriction: DietaryRestriction) => restriction.selected)
        .map((restriction: DietaryRestriction) => restriction.name);
      
      // Create combined parameters
      const combinedParams: FoodParameters = {
        budget: 0, // Removed budget as requested
        distance: params.distance || 0,
        waitTimeMax: 0, // Removed wait time as requested
        dietaryRestrictions: selectedRestrictions
      };
      
      // Get recommendations
      const recommendations = await recommendFoods(foodItems, combinedParams, choice);
      
      if (recommendations.length === 0) {
        toast.error('No food matches your criteria. Try adjusting your preferences.');
        navigate('/food-parameters');
      } else {
        // Set the first recommendation as the current suggestion
        setCurrentSuggestion(recommendations[0]);
      }
    } catch (error) {
      console.error('Error generating food suggestions:', error);
      toast.error('Failed to generate food suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Generate initial suggestion when component mounts
    generateSuggestion();
  }, [navigate]);
  
  const handleLike = () => {
    // User likes this food suggestion (choice = 2)
    // Navigate to food details
    if (currentSuggestion) {
      navigate(`/food-details/${currentSuggestion.id}`);
    }
  };

  const handleDislike = () => {
    // User dislikes this food suggestion (choice = 0)
    generateSuggestion(0);
  };

  const handleShuffle = () => {
    // User wants to shuffle (choice = 1)
    generateSuggestion(1);
  };
  
  if (isLoading) {
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

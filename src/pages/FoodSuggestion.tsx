
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IngredientsModal from '@/components/IngredientsModal';
import SuggestionLoading from '@/components/SuggestionLoading';
import NoSuggestionsFound from '@/components/NoSuggestionsFound';
import FoodSuggestionCard from '@/components/FoodSuggestionCard';
import FeedbackButtons from '@/components/FeedbackButtons';
import { FoodItem, FoodParameters, DietaryRestriction, ModelState } from '@/types';
import { recommendFoods, processCSVData } from '@/utils/foodRecommendation';
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
  
  // Generate a new food suggestion based on parameters and current state
  const generateSuggestion = async (choice: number = -1) => {
    setIsLoading(true);
    
    try {
      // Process the embedded CSV data
      const foodItems = processCSVData(foodCsvData);
      
      // Get parameters from local storage
      const params = JSON.parse(localStorage.getItem('foodParameters') || '{}');
      
      // Get dietary restrictions from local storage
      const savedRestrictions = JSON.parse(localStorage.getItem('dietaryRestrictions') || '[]');
      const selectedRestrictions = savedRestrictions
        .filter((restriction: DietaryRestriction) => restriction.selected)
        .map((restriction: DietaryRestriction) => restriction.name);
      
      // Get current time category
      const timeCategory = getCurrentTimeCategory();
      
      // Get model state from localStorage if available
      let modelState: ModelState | null = null;
      const storedModelState = localStorage.getItem('modelState');
      if (storedModelState) {
        try {
          modelState = JSON.parse(storedModelState);
        } catch (e) {
          console.error('Error parsing stored model state:', e);
        }
      }
      
      // Create combined parameters with user location
      const combinedParams: FoodParameters = {
        dietaryRestrictions: selectedRestrictions,
        longitude: userLocation.longitude || undefined,
        latitude: userLocation.latitude || undefined,
        timeCategory
      };
      
      console.log('Food parameters:', combinedParams);
      console.log('User location:', userLocation);
      
      // Get recommendations
      const recommendations = await recommendFoods(foodItems, combinedParams, choice, modelState);
      
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
    // or when user location changes
    if (!userLocation.loading) {
      generateSuggestion();
    }
  }, [userLocation.loading, navigate]);
  
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

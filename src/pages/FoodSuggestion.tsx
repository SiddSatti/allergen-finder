
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IngredientsModal from '@/components/IngredientsModal';
import SuggestionLoading from '@/components/SuggestionLoading';
import NoSuggestionsFound from '@/components/NoSuggestionsFound';
import FoodSuggestionCard from '@/components/FoodSuggestionCard';
import SuggestionPagination from '@/components/SuggestionPagination';
import FeedbackButtons from '@/components/FeedbackButtons';
import { FoodItem, FoodParameters, DietaryRestriction } from '@/types';
import { recommendFoods, getTestData } from '@/utils/foodRecommendation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const FoodSuggestion = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [foodSuggestions, setFoodSuggestions] = useState<FoodItem[]>([]);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const generateResults = async () => {
      setIsLoading(true);
      
      try {
        // Get food items from local storage
        let foodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
        
        // If no food items are uploaded, use test data
        if (foodItems.length === 0) {
          foodItems = getTestData();
        }
        
        // Get parameters from local storage
        const params = JSON.parse(localStorage.getItem('foodParameters') || '{}');
        
        // Get dietary restrictions from local storage
        const savedRestrictions = JSON.parse(localStorage.getItem('dietaryRestrictions') || '[]');
        const selectedRestrictions = savedRestrictions
          .filter((restriction: DietaryRestriction) => restriction.selected)
          .map((restriction: DietaryRestriction) => restriction.name);
        
        // Create combined parameters
        const combinedParams: FoodParameters = {
          budget: params.budget || 0,
          distance: params.distance || 0,
          waitTimeMax: params.waitTimeMax || 0,
          dietaryRestrictions: selectedRestrictions
        };
        
        // Get recommendations
        const recommendations = await recommendFoods(foodItems, combinedParams);
        
        if (recommendations.length === 0) {
          toast.error('No food matches your criteria. Try adjusting your preferences.');
          navigate('/food-parameters');
        } else {
          setFoodSuggestions(recommendations);
        }
      } catch (error) {
        console.error('Error generating food suggestions:', error);
        toast.error('Failed to generate food suggestions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    generateResults();
  }, [navigate]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < foodSuggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleLike = () => {
    // User likes this food suggestion (choice = 2)
    recommendFoods([], {}, 2).then(() => {
      handleNext();
    });
  };

  const handleDislike = () => {
    // User dislikes this food suggestion (choice = 0)
    recommendFoods([], {}, 0).then(() => {
      handleNext();
    });
  };

  const handleShuffle = () => {
    // User wants to shuffle (choice = 1)
    recommendFoods([], {}, 1).then(() => {
      handleNext();
    });
  };
  
  if (isLoading) {
    return <SuggestionLoading />;
  }
  
  if (foodSuggestions.length === 0) {
    return <NoSuggestionsFound />;
  }
  
  const currentFood = foodSuggestions[currentIndex];
  
  return (
    <div className="bytewise-container bytewise-page-transition">
      <Header 
        title={currentFood.name} 
        showBackButton={true} 
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <SuggestionPagination 
          currentIndex={currentIndex}
          totalItems={foodSuggestions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
        
        <FoodSuggestionCard 
          food={currentFood}
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
        ingredients={currentFood.ingredients}
        foodName={currentFood.name}
      />
    </div>
  );
};

export default FoodSuggestion;

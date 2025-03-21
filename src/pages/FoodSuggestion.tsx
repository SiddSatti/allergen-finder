import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IngredientsModal from '@/components/IngredientsModal';
import { FoodItem, FoodParameters, DietaryRestriction } from '@/types';
import { recommendFoods, getTestData } from '@/utils/foodRecommendation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { X, Clock, MapPin, Info, ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  const handleViewDetails = (id: string) => {
    navigate(`/food-details/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="bytewise-container">
        <Header title="Finding Food" showBackButton={true} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="h-16 w-16 bg-bytewise-blue rounded-full mx-auto"></div>
            </div>
            <p className="text-lg text-gray-600">Finding the perfect meal for you...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (foodSuggestions.length === 0) {
    return (
      <div className="bytewise-container">
        <Header title="No Results" showBackButton={true} />
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg mb-4">No food suggestions found matching your criteria.</p>
            <button 
              onClick={() => navigate('/food-parameters')}
              className="bytewise-btn"
            >
              Adjust Preferences
            </button>
          </div>
        </div>
      </div>
    );
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Suggestion {currentIndex + 1} of {foodSuggestions.length}
          </span>
        </div>
        
        <div className="bytewise-card mb-4">
          <div className="relative bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
            <button 
              onClick={() => setIsIngredientsOpen(true)}
              className="bytewise-btn flex items-center"
            >
              <Info className="h-5 w-5 mr-2" />
              View Ingredients
            </button>
          </div>
          
          <h2 className="text-xl font-bold mb-2">{currentFood.name}</h2>
          
          <div className="flex justify-between mb-4">
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Price:</p>
              <p className="font-bold">${currentFood.price.toFixed(2)}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Distance:</p>
              <p className="font-bold">{currentFood.distance.toFixed(1)} miles</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Wait time:</p>
              <p className="font-bold">{currentFood.waitTime} min</p>
            </div>
          </div>
          
          <div className="flex items-center mb-3">
            <MapPin className="h-4 w-4 mr-2 text-gray-600" />
            <p className="text-sm text-gray-600">{currentFood.location}</p>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-600" />
            <p className="text-sm text-gray-600">{currentFood.waitTime} minutes wait time</p>
          </div>
          
          {currentFood.restrictions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Contains:</p>
              <div className="flex flex-wrap gap-2">
                {currentFood.restrictions.map((restriction, index) => (
                  <span 
                    key={index} 
                    className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full ${
              currentIndex === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-bytewise-blue text-white hover:bg-bytewise-lightblue'
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => handleViewDetails(currentFood.id)}
            className="bytewise-btn"
          >
            View Details
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === foodSuggestions.length - 1}
            className={`p-2 rounded-full ${
              currentIndex === foodSuggestions.length - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-bytewise-blue text-white hover:bg-bytewise-lightblue'
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
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

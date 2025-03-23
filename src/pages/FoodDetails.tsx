
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import IngredientsModal from '@/components/IngredientsModal';
import { FoodItem } from '@/types';
import { processCSVData } from '@/utils/foodRecommendation';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Info, Home } from 'lucide-react';
import { foodCsvData } from '@/data/foodData';

const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  
  useEffect(() => {
    const loadFoodDetails = () => {
      setIsLoading(true);
      
      try {
        // Process the embedded CSV data
        const foodItems = processCSVData(foodCsvData);
        
        // Find the food item with the matching ID
        const foodItem = foodItems.find((item: FoodItem) => item.id === id);
        
        if (foodItem) {
          setFood(foodItem);
        } else {
          console.error('Food item not found:', id);
        }
      } catch (error) {
        console.error('Error loading food details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFoodDetails();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="bytewise-container">
        <Header title="Loading..." showBackButton={true} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="h-16 w-16 bg-bytewise-blue rounded-full mx-auto"></div>
            </div>
            <p className="text-lg text-gray-600">Loading food details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!food) {
    return (
      <div className="bytewise-container">
        <Header title="Not Found" showBackButton={true} />
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg mb-4">Food item not found.</p>
            <button 
              onClick={() => navigate('/food-suggestion')}
              className="bytewise-btn"
            >
              Back to Suggestions
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bytewise-container bytewise-page-transition">
      <Header 
        title={food.name} 
        showBackButton={true} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="bytewise-card mb-6">
          <div className="relative bg-gray-200 h-56 rounded-md mb-4 flex items-center justify-center">
            <button 
              onClick={() => setIsIngredientsOpen(true)}
              className="bytewise-btn flex items-center"
            >
              <Info className="h-5 w-5 mr-2" />
              View Full Ingredients
            </button>
          </div>
          
          <h1 className="text-2xl font-bold mb-3">{food.name}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bytewise-card">
              <MapPin className="h-5 w-5 text-bytewise-blue mb-1" />
              <p className="text-xs text-gray-600">Location</p>
              <p className="font-bold">{food.location}</p>
            </div>
            
            <div className="bytewise-card">
              <MapPin className="h-5 w-5 text-bytewise-blue mb-1" />
              <p className="text-xs text-gray-600">Distance</p>
              <p className="font-bold">{food.distance.toFixed(1)} miles</p>
            </div>
          </div>
          
          {food.subLocation && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Specific Location</h2>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-medium">{food.subLocation}</p>
                <p className="text-sm text-gray-600">{food.location}</p>
              </div>
            </div>
          )}
          
          {food.restrictions.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Dietary Notes</h2>
              <div className="flex flex-wrap gap-2">
                {food.restrictions.map((restriction, index) => (
                  <span 
                    key={index} 
                    className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    Contains {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={() => navigate('/')}
              className="bytewise-btn w-full flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </button>
          </div>
        </div>
      </motion.div>
      
      <IngredientsModal
        isOpen={isIngredientsOpen}
        onClose={() => setIsIngredientsOpen(false)}
        ingredients={food.ingredients}
        foodName={food.name}
      />
    </div>
  );
};

export default FoodDetails;

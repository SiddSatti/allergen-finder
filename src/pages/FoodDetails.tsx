
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { FoodItem } from '@/types';
import { getTestData } from '@/utils/foodRecommendation';
import { MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        // Fetch the food by ID
        const data = getTestData();
        const foodItem = data.find(item => item.id === id);
        
        if (foodItem) {
          setFood(foodItem);
        } else {
          console.error('Food item not found');
        }
      } catch (error) {
        console.error('Error fetching food details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <div className="bytewise-container bytewise-page-transition flex items-center justify-center">
        <div className="text-center">
          <div className="bytewise-loading-spinner mb-4"></div>
          <p className="text-gray-600">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="bytewise-container bytewise-page-transition p-6">
        <Header title="Not Found" showBackButton={true} />
        <div className="text-center mt-10">
          <h2 className="text-xl font-bold">Food item not found</h2>
          <p className="text-gray-600 mt-2">The food item you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="mt-6">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bytewise-container bytewise-page-transition">
      <Header title={food.name} showBackButton={true} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="bytewise-card mb-6">
          <div className="bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
            {/* Placeholder for food image */}
            <p className="text-gray-500">Food Image</p>
          </div>
          
          <div className="flex justify-between mb-4">
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700">Location:</p>
              <p className="font-bold">{food.location}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Distance:</p>
              <p className="font-bold">{food.distance.toFixed(1)} miles</p>
            </div>
          </div>
          
          {food.subLocation && (
            <div className="flex items-center mb-3">
              <MapPin className="h-4 w-4 mr-2 text-gray-600" />
              <p className="text-sm text-gray-600">{food.subLocation}</p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            {food.ingredients && food.ingredients.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {food.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No ingredients information available.</p>
            )}
          </div>
        </div>
        
        {food.restrictions && food.restrictions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Allergens</h3>
            <div className="flex flex-wrap gap-2">
              {food.restrictions.map((restriction, index) => (
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
        
        <Button 
          onClick={() => navigate('/')} 
          className="w-full mt-6"
          variant="default"
        >
          <Home className="h-4 w-4 mr-2" />
          Go Home
        </Button>
      </motion.div>
    </div>
  );
};

export default FoodDetails;

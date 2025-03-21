
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FoodItem } from '@/types';
import { Clock, MapPin, Info } from 'lucide-react';

interface FoodSuggestionCardProps {
  food: FoodItem;
  onViewIngredients: () => void;
}

const FoodSuggestionCard: React.FC<FoodSuggestionCardProps> = ({ 
  food, 
  onViewIngredients 
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/food-details/${id}`);
  };

  return (
    <div className="bytewise-card mb-4">
      <div className="relative bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
        <button 
          onClick={onViewIngredients}
          className="bytewise-btn flex items-center"
        >
          <Info className="h-5 w-5 mr-2" />
          View Ingredients
        </button>
      </div>
      
      <h2 className="text-xl font-bold mb-2">{food.name}</h2>
      
      <div className="flex justify-between mb-4">
        <div className="text-left">
          <p className="text-sm font-medium text-gray-700">Price:</p>
          <p className="font-bold">${food.price.toFixed(2)}</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">Distance:</p>
          <p className="font-bold">{food.distance.toFixed(1)} miles</p>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Wait time:</p>
          <p className="font-bold">{food.waitTime} min</p>
        </div>
      </div>
      
      <div className="flex items-center mb-3">
        <MapPin className="h-4 w-4 mr-2 text-gray-600" />
        <p className="text-sm text-gray-600">{food.location}</p>
      </div>
      
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-gray-600" />
        <p className="text-sm text-gray-600">{food.waitTime} minutes wait time</p>
      </div>
      
      {food.restrictions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Contains:</p>
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
      
      <div className="mt-4">
        <button
          onClick={() => handleViewDetails(food.id)}
          className="bytewise-btn w-full"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default FoodSuggestionCard;

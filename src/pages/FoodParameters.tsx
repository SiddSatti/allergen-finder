
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ParameterInput from '@/components/ParameterInput';
import { MapPin, Clock } from 'lucide-react';
import useUserLocation from '@/hooks/useUserLocation';
import { motion } from 'framer-motion';

const FoodParameters = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState('');
  const userLocation = useUserLocation();
  
  const handleGenerateResults = () => {
    const params = {
      distance: parseFloat(distance) || 0,
    };
    
    localStorage.setItem('foodParameters', JSON.stringify(params));
    navigate('/food-suggestion');
  };
  
  return (
    <div className="bytewise-container bytewise-page-transition">
      <Header 
        title="Food Parameters" 
        showBackButton={true} 
      />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Set Your Preferences</h2>
          <p className="text-gray-600 mb-6">
            Enter your preference for maximum distance. Leave blank for no preference.
          </p>
          
          <ParameterInput
            label="Distance"
            value={distance}
            onChange={setDistance}
            placeholder="Enter maximum distance (miles)"
            type="number"
            min={0}
            step={0.1}
          />
          
          <div className="mt-6 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-3">Your Preferences</h3>
            
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-2 text-gray-600" />
              <p className="text-sm text-gray-700">
                We're showing food available for the current time of day.
              </p>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-600" />
              <p className="text-sm text-gray-700">
                {userLocation.loading ? (
                  "Detecting your location..."
                ) : userLocation.error ? (
                  "Location unavailable. Some recommendations may not be accurate."
                ) : (
                  "Using your current location for distance calculations."
                )}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateResults}
              className="bytewise-btn"
            >
              Generate Results
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodParameters;

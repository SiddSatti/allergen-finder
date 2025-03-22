
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ParameterInput from '@/components/ParameterInput';
import { motion } from 'framer-motion';

const FoodParameters = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState('');
  
  const handleGenerateResults = () => {
    const params = {
      budget: 0, // Setting to 0 as requested to remove from UI
      distance: parseFloat(distance) || 0,
      waitTimeMax: 0, // Setting to 0 as requested to remove from UI
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
          
          <div className="flex justify-center mt-8">
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

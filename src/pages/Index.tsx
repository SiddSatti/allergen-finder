
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // We'll use local storage to store our food data and parameters
    if (!localStorage.getItem('foodItems')) {
      localStorage.setItem('foodItems', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('dietaryRestrictions')) {
      const defaultRestrictions = [
        { id: '1', name: 'Dairy', selected: false },
        { id: '2', name: 'Gluten', selected: false },
        { id: '3', name: 'Nuts', selected: false },
        { id: '4', name: 'Soy', selected: false },
        { id: '5', name: 'Fish', selected: false },
        { id: '6', name: 'Shellfish', selected: false },
        { id: '7', name: 'Egg', selected: false },
        { id: '8', name: 'Peanuts', selected: false }
      ];
      localStorage.setItem('dietaryRestrictions', JSON.stringify(defaultRestrictions));
    }
  }, []);

  const handleStart = () => {
    navigate('/dietary-restrictions');
  };

  return (
    <div className="bytewise-container">
      <div className="min-h-screen flex flex-col">
        <Header title="Byte Wise" showBackButton={false} />
        
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-bytewise-blue rounded-full p-6"
          >
            <Utensils className="h-16 w-16 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-center mb-4"
          >
            Find Your Perfect Meal
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center text-gray-600 mb-8"
          >
            Get personalized food recommendations based on your dietary restrictions and preferences at Penn State eateries.
          </motion.p>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="bytewise-btn"
          >
            Get Started
          </motion.button>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 text-sm text-gray-500 text-center"
          >
            <p>
              Developed for Penn State University students
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;

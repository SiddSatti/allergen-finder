import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DietaryRestrictionTag from '@/components/DietaryRestrictionTag';
import { DietaryRestriction } from '@/types';
import { processCSVData } from '@/utils/foodRecommendation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const DietaryRestrictions = () => {
  const navigate = useNavigate();
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [newRestriction, setNewRestriction] = useState('');
  
  useEffect(() => {
    // First check if user is logged in
    const userProfileStr = localStorage.getItem('userProfile');
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      
      // If user has dietary restrictions saved, use those
      if (userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0) {
        setRestrictions(userProfile.dietaryRestrictions);
        return;
      }
    }
    
    // Otherwise check for saved restrictions or use defaults
    const savedRestrictions = localStorage.getItem('dietaryRestrictions');
    if (savedRestrictions) {
      setRestrictions(JSON.parse(savedRestrictions));
    } else {
      // Default restrictions if nothing is saved
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
      setRestrictions(defaultRestrictions);
    }
  }, []);
  
  const handleSelectRestriction = (id: string) => {
    const updatedRestrictions = restrictions.map(restriction => 
      restriction.id === id 
        ? { ...restriction, selected: !restriction.selected } 
        : restriction
    );
    
    setRestrictions(updatedRestrictions);
    localStorage.setItem('dietaryRestrictions', JSON.stringify(updatedRestrictions));
    
    // If user is logged in, update their profile
    const userProfileStr = localStorage.getItem('userProfile');
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      userProfile.dietaryRestrictions = updatedRestrictions;
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  };
  
  const handleAddRestriction = () => {
    if (newRestriction.trim() === '') return;
    
    const newId = (restrictions.length + 1).toString();
    const updatedRestrictions = [
      ...restrictions,
      { id: newId, name: newRestriction.trim(), selected: true }
    ];
    
    setRestrictions(updatedRestrictions);
    localStorage.setItem('dietaryRestrictions', JSON.stringify(updatedRestrictions));
    
    // If user is logged in, update their profile
    const userProfileStr = localStorage.getItem('userProfile');
    if (userProfileStr) {
      const userProfile = JSON.parse(userProfileStr);
      userProfile.dietaryRestrictions = updatedRestrictions;
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
    
    setNewRestriction('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRestriction();
    }
  };
  
  const handleContinue = () => {
    navigate('/food-parameters');
  };
  
  return (
    <div className="bytewise-container bytewise-page-transition">
      <Header 
        title="Dietary Restrictions" 
        showBackButton={true} 
      />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Select Your Restrictions</h2>
          <p className="text-gray-600 mb-6">
            Choose any dietary restrictions that apply to you. We'll use these to filter your food suggestions.
          </p>
          
          <div className="mb-6">
            {restrictions.map(restriction => (
              <DietaryRestrictionTag
                key={restriction.id}
                restriction={restriction}
                onSelect={handleSelectRestriction}
                isRemovable={true}
                onRemove={handleSelectRestriction}
              />
            ))}
          </div>
          
          <div className="mb-8">
            <div className="flex mb-2">
              <input
                type="text"
                value={newRestriction}
                onChange={(e) => setNewRestriction(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add custom restriction..."
                className="bytewise-input flex-1 mr-2"
              />
              <button
                onClick={handleAddRestriction}
                className="bytewise-btn flex items-center justify-center"
                disabled={newRestriction.trim() === ''}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className="bytewise-btn"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DietaryRestrictions;

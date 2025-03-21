
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DietaryRestrictionTag from '@/components/DietaryRestrictionTag';
import CsvUploader from '@/components/CsvUploader';
import { DietaryRestriction, CsvData } from '@/types';
import { processCSVData } from '@/utils/foodRecommendation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const DietaryRestrictions = () => {
  const navigate = useNavigate();
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [newRestriction, setNewRestriction] = useState('');
  
  useEffect(() => {
    const savedRestrictions = localStorage.getItem('dietaryRestrictions');
    if (savedRestrictions) {
      setRestrictions(JSON.parse(savedRestrictions));
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
    setNewRestriction('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRestriction();
    }
  };
  
  const handleCsvUpload = (data: CsvData[]) => {
    const foodItems = processCSVData(data);
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
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
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Upload Food Data</h3>
            <p className="text-gray-600 mb-4">
              Upload a CSV file with food data to get personalized recommendations.
            </p>
            <CsvUploader onUpload={handleCsvUpload} />
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

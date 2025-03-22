
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ParameterInput from '@/components/ParameterInput';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getCurrentTimeCategory } from '@/utils/timeUtils';
import { CsvData, FoodItem } from '@/types';
import { processCSVData } from '@/utils/foodRecommendation';
import CsvPasteInput from '@/components/CsvPasteInput';

const FoodParameters = () => {
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState<FoodItem[]>([]);

  const handleCsvParsed = (data: CsvData[]) => {
    const processedData = processCSVData(data);
    setCsvData(processedData);
    
    // Store data in localStorage for use in other components
    localStorage.setItem('foodItems', JSON.stringify(processedData));
    
    console.log('Processed CSV data:', processedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If no CSV data has been parsed, show a warning
    if (csvData.length === 0) {
      toast.warning('Please paste and parse some CSV data before continuing');
      return;
    }
    
    // Get current time category
    const timeCategory = getCurrentTimeCategory();
    
    // Store food parameters in local storage
    localStorage.setItem('foodParameters', JSON.stringify({
      timeCategory
    }));
    
    // Navigate to food suggestion page
    navigate('/food-suggestion');
  };

  return (
    <div className="bytewise-container bytewise-page-transition">
      <Header 
        title="Food Parameters" 
        showBackButton={true} 
      />
      
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <CsvPasteInput onParsed={handleCsvParsed} />
          
          <div className="mt-8">
            <p className="text-center text-sm text-gray-500 mb-2">
              Current time category: <span className="font-medium">{getCurrentTimeCategory()}</span>
            </p>
            
            <Button 
              type="submit" 
              className="w-full"
            >
              Get Food Suggestions
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodParameters;

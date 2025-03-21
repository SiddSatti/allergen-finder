
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const NoSuggestionsFound: React.FC = () => {
  const navigate = useNavigate();
  
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
};

export default NoSuggestionsFound;

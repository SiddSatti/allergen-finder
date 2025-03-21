
import React from 'react';
import Header from '@/components/Header';

const SuggestionLoading: React.FC = () => {
  return (
    <div className="bytewise-container">
      <Header title="Finding Food" showBackButton={true} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="h-16 w-16 bg-bytewise-blue rounded-full mx-auto"></div>
          </div>
          <p className="text-lg text-gray-600">Finding the perfect meal for you...</p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionLoading;

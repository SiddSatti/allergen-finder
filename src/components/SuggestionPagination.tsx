
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SuggestionPaginationProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

const SuggestionPagination: React.FC<SuggestionPaginationProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className={`p-2 rounded-full ${
          currentIndex === 0 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-bytewise-blue text-white hover:bg-bytewise-lightblue'
        }`}
        aria-label="Previous suggestion"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <span className="text-sm text-gray-500">
        Suggestion {currentIndex + 1} of {totalItems}
      </span>
      
      <button
        onClick={onNext}
        disabled={currentIndex === totalItems - 1}
        className={`p-2 rounded-full ${
          currentIndex === totalItems - 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-bytewise-blue text-white hover:bg-bytewise-lightblue'
        }`}
        aria-label="Next suggestion"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default SuggestionPagination;

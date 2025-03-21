
import React from 'react';
import { ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

interface FeedbackButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  onShuffle: () => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ onLike, onDislike, onShuffle }) => {
  return (
    <div className="flex justify-center space-x-4 my-4">
      <button
        onClick={onDislike}
        className="p-3 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
        aria-label="Dislike"
      >
        <ThumbsDown className="h-6 w-6" />
      </button>
      
      <button
        onClick={onShuffle}
        className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        aria-label="Shuffle"
      >
        <RefreshCw className="h-6 w-6" />
      </button>
      
      <button
        onClick={onLike}
        className="p-3 rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition-colors"
        aria-label="Like"
      >
        <ThumbsUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FeedbackButtons;

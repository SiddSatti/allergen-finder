
import React from 'react';
import { DietaryRestriction } from '@/types';
import { X } from 'lucide-react';

interface DietaryRestrictionTagProps {
  restriction: DietaryRestriction;
  onSelect: (id: string) => void;
  onRemove?: (id: string) => void;
  isRemovable?: boolean;
}

const DietaryRestrictionTag: React.FC<DietaryRestrictionTagProps> = ({ 
  restriction, 
  onSelect, 
  onRemove,
  isRemovable = false 
}) => {
  return (
    <div 
      className={`transition-all duration-300 flex items-center justify-between ${
        restriction.selected ? 'bytewise-tag-selected' : 'bytewise-tag'
      } mb-2 w-full`}
      onClick={() => onSelect(restriction.id)}
    >
      <span>{restriction.name}</span>
      {isRemovable && restriction.selected && onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(restriction.id);
          }}
          className="ml-2 p-1 rounded-full hover:bg-red-500 transition-colors"
          aria-label={`Remove ${restriction.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default DietaryRestrictionTag;

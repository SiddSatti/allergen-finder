
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface IngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: string[];
  foodName: string;
}

const IngredientsModal: React.FC<IngredientsModalProps> = ({
  isOpen,
  onClose,
  ingredients,
  foodName
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="bytewise-modal">
      <div ref={modalRef} className="bytewise-modal-content">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{foodName} Ingredients</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="divide-y">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="py-2">
              {ingredient}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientsModal;

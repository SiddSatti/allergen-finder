
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showProfileButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false, 
  showProfileButton = true, 
  onBackClick 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="bytewise-header rounded-b-lg">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            className="mr-2 p-1 rounded-full hover:bg-bytewise-lightblue transition-colors"
            onClick={handleBackClick}
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div className="flex flex-col items-center mx-auto">
          <h1 className="text-2xl font-semibold">
            {title === "Byte Wise" ? (
              <span className="flex flex-col items-center">
                <span>Byte</span>
                <span>Wise</span>
              </span>
            ) : title}
          </h1>
        </div>
      </div>
      {showProfileButton && (
        <div className="rounded-full border-2 border-white p-1">
          <User className="h-6 w-6" />
        </div>
      )}
    </header>
  );
};

export default Header;

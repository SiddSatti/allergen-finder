
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleLogin = () => {
    if (!email.trim()) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoggingIn(true);
    
    // In a real app, this would be a call to your authentication service
    setTimeout(() => {
      // Save user info to localStorage
      const userId = `user_${Date.now()}`;
      const userProfile = {
        id: userId,
        email: email,
        dietaryRestrictions: [],
      };
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      // Save the current dietary restrictions if we're on that page
      if (location.pathname === '/dietary-restrictions') {
        const dietaryRestrictions = localStorage.getItem('dietaryRestrictions');
        if (dietaryRestrictions) {
          userProfile.dietaryRestrictions = JSON.parse(dietaryRestrictions);
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
      }
      
      setIsLoggingIn(false);
      setShowLoginDialog(false);
      toast.success(`Welcome, ${email}!`);
    }, 1000);
  };

  // Get user info from localStorage
  const userProfileStr = localStorage.getItem('userProfile');
  const userProfile = userProfileStr ? JSON.parse(userProfileStr) : null;

  return (
    <>
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
          <button 
            className="rounded-full border-2 border-white p-1 hover:bg-bytewise-lightblue transition-colors"
            onClick={handleLoginClick}
            aria-label={userProfile ? "Profile" : "Login"}
          >
            <User className="h-6 w-6" />
          </button>
        )}
      </header>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{userProfile ? 'Your Profile' : 'Sign in'}</DialogTitle>
            <DialogDescription>
              {userProfile 
                ? 'Your preferences are saved automatically.' 
                : 'Enter your email to save your preferences.'}
            </DialogDescription>
          </DialogHeader>
          
          {userProfile ? (
            <div className="py-4">
              <p className="mb-2"><strong>Email:</strong> {userProfile.email}</p>
              
              <div className="mt-4">
                <p className="mb-2"><strong>Dietary Restrictions:</strong></p>
                {userProfile.dietaryRestrictions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.dietaryRestrictions
                      .filter(r => r.selected)
                      .map(restriction => (
                        <span key={restriction.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {restriction.name}
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No restrictions set</p>
                )}
              </div>
              
              <button
                className="mt-6 w-full bytewise-btn"
                onClick={() => {
                  localStorage.removeItem('userProfile');
                  setShowLoginDialog(false);
                  toast.info('You have been logged out');
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full"
                  />
                </div>
                
                <Button 
                  className="w-full bytewise-btn" 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;


// Time category constants
export const TIME_CATEGORIES = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  OTHER: 'Other'
};

/**
 * Gets the current time category based on the hour
 * Breakfast: 7-11, Lunch: 11-14, Dinner: 17-20
 */
export const getCurrentTimeCategory = (): string => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 7 && hour < 11) {
    return TIME_CATEGORIES.BREAKFAST;
  } else if (hour >= 11 && hour < 14) {
    return TIME_CATEGORIES.LUNCH;
  } else if (hour >= 17 && hour < 20) {
    return TIME_CATEGORIES.DINNER;
  } else {
    return TIME_CATEGORIES.OTHER;
  }
};

/**
 * Parse the time string from CSV and determine the time category
 * Example: "HALAL CART- AVAILABLE 2PM-10PM" -> "Lunch" or "Dinner"
 */
export const parseTimeCategory = (timeString: string): string => {
  // Default to "Other" if we can't determine
  if (!timeString) return TIME_CATEGORIES.OTHER;
  
  const lowerCaseTime = timeString.toLowerCase();
  
  if (lowerCaseTime.includes('breakfast') || lowerCaseTime.includes('7am') || lowerCaseTime.includes('8am') || 
      lowerCaseTime.includes('9am') || lowerCaseTime.includes('10am')) {
    return TIME_CATEGORIES.BREAKFAST;
  }
  
  if (lowerCaseTime.includes('lunch') || lowerCaseTime.includes('11am') || lowerCaseTime.includes('12pm') || 
      lowerCaseTime.includes('1pm') || lowerCaseTime.includes('2pm')) {
    return TIME_CATEGORIES.LUNCH;
  }
  
  if (lowerCaseTime.includes('dinner') || lowerCaseTime.includes('5pm') || lowerCaseTime.includes('6pm') || 
      lowerCaseTime.includes('7pm') || lowerCaseTime.includes('8pm')) {
    return TIME_CATEGORIES.DINNER;
  }
  
  return TIME_CATEGORIES.OTHER;
};

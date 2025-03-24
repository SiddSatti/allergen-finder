
// Time category constants
export const TIME_CATEGORIES = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  OTHER: 'Other'
};

/**
 * Gets the current time category based on the hour
 * Breakfast: 5-11, Lunch: 11-16, Dinner: 16-22, Other: 22-5
 */
export const getCurrentTimeCategory = (): string => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 11) {
    return TIME_CATEGORIES.BREAKFAST;
  } else if (hour >= 11 && hour < 16) {
    return TIME_CATEGORIES.LUNCH;
  } else if (hour >= 16 && hour < 22) {
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
  
  // Check for specific time categories
  if (lowerCaseTime.includes('breakfast') || 
      lowerCaseTime.includes('morning') ||
      /\b[5-9]am\b/.test(lowerCaseTime) || 
      /\b10am\b/.test(lowerCaseTime)) {
    return TIME_CATEGORIES.BREAKFAST;
  }
  
  if (lowerCaseTime.includes('lunch') || 
      /\b11am\b/.test(lowerCaseTime) || 
      /\b12pm\b/.test(lowerCaseTime) || 
      /\b[1-3]pm\b/.test(lowerCaseTime)) {
    return TIME_CATEGORIES.LUNCH;
  }
  
  if (lowerCaseTime.includes('dinner') || 
      lowerCaseTime.includes('evening') ||
      /\b[4-9]pm\b/.test(lowerCaseTime)) {
    return TIME_CATEGORIES.DINNER;
  }
  
  // Check for time ranges that span multiple categories
  if (lowerCaseTime.includes('all day') || 
      lowerCaseTime.includes('24 hour') || 
      lowerCaseTime.includes('24hr')) {
    // Return the current time category for all-day places
    return getCurrentTimeCategory();
  }
  
  // For time ranges, check if the current time falls within
  const timeRangeMatch = lowerCaseTime.match(/(\d+)(am|pm)[^\d]+-(\d+)(am|pm)/);
  if (timeRangeMatch) {
    const startHour = parseInt(timeRangeMatch[1]);
    const startAmPm = timeRangeMatch[2];
    const endHour = parseInt(timeRangeMatch[3]);
    const endAmPm = timeRangeMatch[4];
    
    // Convert to 24-hour format
    let start24 = startHour;
    if (startAmPm === 'pm' && startHour < 12) start24 += 12;
    if (startAmPm === 'am' && startHour === 12) start24 = 0;
    
    let end24 = endHour;
    if (endAmPm === 'pm' && endHour < 12) end24 += 12;
    if (endAmPm === 'am' && endHour === 12) end24 = 0;
    
    // Get current hour
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if current time falls in range
    if (end24 > start24) {
      // Normal range (e.g., 9am-5pm)
      if (currentHour >= start24 && currentHour < end24) {
        return getCurrentTimeCategory();
      }
    } else {
      // Overnight range (e.g., 5pm-2am)
      if (currentHour >= start24 || currentHour < end24) {
        return getCurrentTimeCategory();
      }
    }
  }
  
  return TIME_CATEGORIES.OTHER;
};

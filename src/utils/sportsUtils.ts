/**
 * Sports Utilities - Central place for sport-related conversions and mappings
 * 
 * This handles:
 * - Converting between display names (e.g., "Ultimate Frisbee") and DB enum values (e.g., "ULTIMATE_FRISBEE")
 * - Sport emojis for UI
 * - Case-insensitive conversions
 * - Space/underscore handling
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Converting user input to database value:
 *    ```typescript
 *    const userInput = "Soccer"; // or "soccer" or "SOCCER"
 *    const dbValue = toDbSportValue(userInput); // Returns: "SOCCER"
 *    ```
 * 
 * 2. Converting database value to display name:
 *    ```typescript
 *    const dbValue = "ULTIMATE_FRISBEE";
 *    const displayName = toDisplaySportName(dbValue); // Returns: "Ultimate Frisbee"
 *    ```
 * 
 * 3. Getting sport emoji (works with both formats):
 *    ```typescript
 *    getSportEmoji("Soccer"); // Returns: "⚽"
 *    getSportEmoji("SOCCER"); // Returns: "⚽"
 *    ```
 * 
 * 4. Populating dropdown with all sports:
 *    ```typescript
 *    const sportsList = getAllSportsDisplayNames(); 
 *    // Returns: ["Badminton", "Baseball", "Basketball", ...]
 *    ```
 * 
 * 5. Database query with enum values:
 *    ```typescript
 *    const allDbValues = getAllSportsDbValues();
 *    // Returns: ["BADMINTON", "BASEBALL", "BASKETBALL", ...]
 *    ```
 * 
 * EDGE CASES HANDLED:
 * - Case insensitivity: "soccer", "Soccer", "SOCCER" all work
 * - Extra whitespace: "  Soccer  " works
 * - Unknown sports: defaults to "OTHER"
 * - Spaces in names: "Ultimate Frisbee" <-> "ULTIMATE_FRISBEE"
 */

// Database enum values (as they exist in the database)
export type SportType = 
  | 'BADMINTON'
  | 'BASEBALL'
  | 'BASKETBALL'
  | 'CRICKET'
  | 'CYCLING'
  | 'FOOTBALL'
  | 'GOLF'
  | 'HOCKEY'
  | 'OTHER'
  | 'PICKLEBALL'
  | 'RUGBY'
  | 'RUNNING'
  | 'SOCCER'
  | 'TENNIS'
  | 'ULTIMATE_FRISBEE'
  | 'VOLLEYBALL';

// Mapping between display names and database enum values
const SPORT_MAPPING: Record<string, SportType> = {
  'badminton': 'BADMINTON',
  'baseball': 'BASEBALL',
  'basketball': 'BASKETBALL',
  'cricket': 'CRICKET',
  'cycling': 'CYCLING',
  'football': 'FOOTBALL',
  'golf': 'GOLF',
  'hockey': 'HOCKEY',
  'other': 'OTHER',
  'pickleball': 'PICKLEBALL',
  'rugby': 'RUGBY',
  'running': 'RUNNING',
  'soccer': 'SOCCER',
  'tennis': 'TENNIS',
  'ultimate frisbee': 'ULTIMATE_FRISBEE',
  'volleyball': 'VOLLEYBALL',
};

// Reverse mapping - from DB enum to display name
const DISPLAY_NAME_MAPPING: Record<SportType, string> = {
  'BADMINTON': 'Badminton',
  'BASEBALL': 'Baseball',
  'BASKETBALL': 'Basketball',
  'CRICKET': 'Cricket',
  'CYCLING': 'Cycling',
  'FOOTBALL': 'Football',
  'GOLF': 'Golf',
  'HOCKEY': 'Hockey',
  'OTHER': 'Other',
  'PICKLEBALL': 'Pickleball',
  'RUGBY': 'Rugby',
  'RUNNING': 'Running',
  'SOCCER': 'Soccer',
  'TENNIS': 'Tennis',
  'ULTIMATE_FRISBEE': 'Ultimate Frisbee',
  'VOLLEYBALL': 'Volleyball',
};

// Sport emojis
export const SPORT_EMOJIS: Record<SportType, string> = {
  'BADMINTON': '🏸',
  'BASEBALL': '⚾',
  'BASKETBALL': '🏀',
  'CRICKET': '🏏',
  'CYCLING': '🚴',
  'FOOTBALL': '🏈',
  'GOLF': '⛳',
  'HOCKEY': '🏒',
  'OTHER': '🎯',
  'PICKLEBALL': '🎾',
  'RUGBY': '🏉',
  'RUNNING': '🏃',
  'SOCCER': '⚽',
  'TENNIS': '🎾',
  'ULTIMATE_FRISBEE': '🥏',
  'VOLLEYBALL': '🏐',
};

/**
 * Convert a display name (e.g., "Ultimate Frisbee") to database enum value (e.g., "ULTIMATE_FRISBEE")
 * Case-insensitive and handles spaces
 */
export function toDbSportValue(displayName: string): SportType {
  const normalized = displayName.toLowerCase().trim();
  const dbValue = SPORT_MAPPING[normalized];
  
  if (!dbValue) {
    console.warn(`Unknown sport: "${displayName}", defaulting to OTHER`);
    return 'OTHER';
  }
  
  return dbValue;
}

/**
 * Convert a database enum value (e.g., "ULTIMATE_FRISBEE") to display name (e.g., "Ultimate Frisbee")
 */
export function toDisplaySportName(dbValue: string): string {
  const normalized = dbValue.toUpperCase() as SportType;
  const displayName = DISPLAY_NAME_MAPPING[normalized];
  
  if (!displayName) {
    // Fallback: capitalize first letter of each word and replace underscores
    return dbValue
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return displayName;
}

/**
 * Get emoji for a sport (works with both display name and DB value)
 * If customEmoji is provided (for OTHER sport), it will be used instead
 */
export function getSportEmoji(sport: string, customEmoji?: string | null): string {
  // If custom emoji is provided and sport is OTHER, use it
  if (customEmoji && (sport === 'OTHER' || sport.toLowerCase() === 'other')) {
    return customEmoji;
  }
  
  // Try as DB value first
  let dbValue = sport.toUpperCase() as SportType;
  if (SPORT_EMOJIS[dbValue]) {
    return SPORT_EMOJIS[dbValue];
  }
  
  // Try converting from display name
  dbValue = toDbSportValue(sport);
  return SPORT_EMOJIS[dbValue] || '🎯';
}

/**
 * Get all sports as display names (for dropdowns, filters, etc.)
 */
export function getAllSportsDisplayNames(): string[] {
  return Object.values(DISPLAY_NAME_MAPPING);
}

/**
 * Get all sports as DB enum values
 */
export function getAllSportsDbValues(): SportType[] {
  return Object.keys(DISPLAY_NAME_MAPPING) as SportType[];
}

/**
 * Check if a sport value is valid
 */
export function isValidSport(sport: string): boolean {
  const normalized = sport.toLowerCase().trim();
  return normalized in SPORT_MAPPING;
}

/**
 * Format sport display name with custom name for "Other" sports
 * @param sport - The sport database value
 * @param customSportName - The custom sport name (if sport is "OTHER")
 * @returns Formatted display name (e.g., "Other - Custom Name" or "Basketball")
 */
export function formatSportDisplay(sport: string, customSportName?: string | null): string {
  const displayName = toDisplaySportName(sport);
  
  // If sport is "Other" and we have a custom name, format as "Other - Custom Name"
  if (displayName === 'Other' && customSportName && customSportName.trim()) {
    return `Other - ${customSportName.trim()}`;
  }
  
  return displayName;
}

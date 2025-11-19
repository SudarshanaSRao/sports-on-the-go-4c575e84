// Current version of Terms and Conditions
// Update this version number whenever the terms are updated
// Format: "X.Y" where X is major version, Y is minor version
export const CURRENT_TERMS_VERSION = "3.0";

// History of terms versions (for reference)
export const TERMS_VERSION_HISTORY = [
  {
    version: "1.0",
    date: "2025-11-16",
    description: "Initial version of Terms and Conditions",
  },
  {
    version: "2.0",
    date: "2025-11-19",
    description: "Added comprehensive Prohibited Content and User Conduct policies including protections against profanity, hate speech, harassment, and inappropriate content with enforcement mechanisms",
  },
  {
    version: "3.0",
    date: "2025-11-19",
    description: "Major legal update: Added 18+ age requirement (Section 2.6), comprehensive data retention and deletion policy (Section 6.5), expanded account termination procedures with appeal process (Section 7), intellectual property and user content rights (Section 11.5), DMCA copyright compliance with takedown procedures (Section 11.6), user representations and warranties (Section 3.6), service modification and discontinuation rights (Section 12.5), publicity rights and image consent requirements (Section 19.3), third-party links disclaimer (Section 19.5), and enhanced contact information for DMCA and age verification",
  },
];

// Helper function to get the latest version info
export const getLatestVersionInfo = () => {
  return TERMS_VERSION_HISTORY[TERMS_VERSION_HISTORY.length - 1];
};

// Helper function to format date for display (UTC-safe to avoid timezone shifts)
export const formatVersionDate = (dateString: string) => {
  // Expecting YYYY-MM-DD; format using UTC to prevent off-by-one day in some timezones
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

// Helper function to get version info by version number
export const getVersionInfo = (version: string) => {
  return TERMS_VERSION_HISTORY.find((v) => v.version === version);
};

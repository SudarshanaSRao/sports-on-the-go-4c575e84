// Current version of Terms and Conditions
// Update this version number whenever the terms are updated
// Format: "X.Y" where X is major version, Y is minor version
export const CURRENT_TERMS_VERSION = "1.0";

// History of terms versions (for reference)
export const TERMS_VERSION_HISTORY = [
  {
    version: "1.0",
    date: "2025-01-15",
    description: "Initial version of Terms and Conditions",
  },
  // Add new versions here when terms are updated
  // Example:
  // {
  //   version: "2.0",
  //   date: "2025-02-01",
  //   description: "Updated liability provisions and dispute resolution",
  // },
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

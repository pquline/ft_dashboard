export const CHART_COLORS = {
  PIE_COLORS: [
    "#ea580c", // Orange-600
    "#fb923c", // Orange-400
    "#f97316", // Orange-500
    "#c2410c", // Orange-600
    "#f59e0b", // Amber-500
    "#d97706", // Amber-600
  ],
  BAR_COLORS: {
    LOW: "#fdba74",      // Orange-300 for low attendance (< 4h)
    MEDIUM_LOW: "#fb923c", // Orange-400 for medium-low (4-8h)
    MEDIUM: "#f97316",     // Orange-500 for medium (8-12h)
    HIGH: "#ea580c",       // Orange-600 for high attendance (>= 12h)
    DEFAULT: "#8884d8",    // Default purple for all sources
  },
} as const;

export const ATTENDANCE_THRESHOLDS = {
  LOW: 4,      // hours
  MEDIUM_LOW: 8, // hours
  MEDIUM: 12,    // hours
} as const;

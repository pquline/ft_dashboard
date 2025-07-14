export const CHART_COLORS = {
  PIE_COLORS: [
    'url(#gradient-blue)',   // Vibrant blue glass gradient
    'url(#gradient-orange)', // Vibrant orange glass gradient
    'url(#gradient-green)',  // Vibrant green glass gradient
    'url(#gradient-purple)', // Vibrant purple glass gradient
  ],
  BAR_COLORS: {
    LOW: 'url(#bar-glass-low)',         // Soft slate glass gradient
    MEDIUM_LOW: 'url(#bar-glass-medlow)', // Blue glass gradient
    MEDIUM: 'url(#bar-glass-medium)',     // Teal glass gradient
    HIGH: 'url(#bar-glass-high)',         // Indigo glass gradient
    DEFAULT: 'url(#bar-glass-default)',   // Neutral glass gradient
  },
  // For dark mode, define additional gradients in the chart SVG <defs> and reference as needed
} as const;

export const ATTENDANCE_THRESHOLDS = {
  LOW: 4,      // hours
  MEDIUM_LOW: 8, // hours
  MEDIUM: 12,    // hours
} as const;

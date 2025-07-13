export const CHART_COLORS = {
  PIE_COLORS: [
    // Subtle glassmorphic gradients with neutral, professional colors
    'url(#pie-glass-blue)',   // Soft blue glass gradient
    'url(#pie-glass-teal)',   // Teal glass gradient
    'url(#pie-glass-slate)',  // Slate glass gradient
    'url(#pie-glass-indigo)', // Indigo glass gradient
    'url(#pie-glass-cyan)',   // Cyan glass gradient
    'url(#pie-glass-gray)',   // Gray glass gradient
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

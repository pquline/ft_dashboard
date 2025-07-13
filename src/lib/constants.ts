export const CHART_COLORS = {
  PIE_COLORS: [
    // Glassmorphic-inspired semi-transparent gradients (for SVG <defs>)
    'url(#pie-glass-orange)', // Orange glass gradient
    'url(#pie-glass-amber)',  // Amber glass gradient
    'url(#pie-glass-blue)',   // Blue glass gradient
    'url(#pie-glass-green)',  // Green glass gradient
    'url(#pie-glass-purple)', // Purple glass gradient
    'url(#pie-glass-pink)',   // Pink glass gradient
  ],
  BAR_COLORS: {
    LOW: 'url(#bar-glass-low)',         // Soft orange glass gradient
    MEDIUM_LOW: 'url(#bar-glass-medlow)', // Amber glass gradient
    MEDIUM: 'url(#bar-glass-medium)',     // Blue glass gradient
    HIGH: 'url(#bar-glass-high)',         // Green glass gradient
    DEFAULT: 'url(#bar-glass-default)',   // Neutral glass gradient
  },
  // For dark mode, define additional gradients in the chart SVG <defs> and reference as needed
} as const;

export const ATTENDANCE_THRESHOLDS = {
  LOW: 4,      // hours
  MEDIUM_LOW: 8, // hours
  MEDIUM: 12,    // hours
} as const;

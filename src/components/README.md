# Dashboard Components Architecture

This document describes the refactored component structure for the FT Dashboard application.

## Overview

The dashboard has been refactored into a modular, maintainable architecture with clear separation of concerns:

- **State Management**: Custom hooks handle business logic
- **Layout Components**: Handle overall page structure
- **Content Components**: Organize main content areas
- **Chart Components**: Dedicated chart visualizations
- **Table Components**: Data table displays
- **Constants**: Centralized configuration values

## Component Structure

### Core Components

#### `DashboardClient` (`src/components/DashboardClient.tsx`)
- **Purpose**: Main entry point component
- **Responsibilities**:
  - Orchestrates the dashboard layout
  - Uses custom hook for state management
  - Renders layout and content components

#### `DashboardLayout` (`src/components/layout/DashboardLayout.tsx`)
- **Purpose**: Handles overall page layout
- **Responsibilities**:
  - Renders Header and Footer
  - Provides layout structure
  - Manages navigation state

#### `DashboardContent` (`src/components/dashboard/DashboardContent.tsx`)
- **Purpose**: Organizes main dashboard content
- **Responsibilities**:
  - Renders summary cards
  - Arranges charts and tables
  - Handles content layout

### Chart Components

#### `DailyAttendanceChart` (`src/components/charts/DailyAttendanceChart.tsx`)
- **Purpose**: Displays daily attendance bar chart
- **Features**:
  - Color-coded bars based on attendance hours
  - Interactive tooltips
  - Responsive design

#### `SourcesDistributionChart` (`src/components/charts/SourcesDistributionChart.tsx`)
- **Purpose**: Shows sources distribution pie chart
- **Features**:
  - Donut chart with legend
  - Hover effects
  - Empty state handling

### Table Components

#### `SourcesDetailsTable` (`src/components/tables/SourcesDetailsTable.tsx`)
- **Purpose**: Displays detailed source information
- **Features**:
  - Filtered data display
  - Badge indicators for source types
  - Empty state handling

### State Management

#### `useDashboardState` (`src/hooks/useDashboardState.ts`)
- **Purpose**: Custom hook for dashboard state management
- **Responsibilities**:
  - Manages selected month and source
  - Calculates attendance data
  - Handles data transformations
  - Provides event handlers

### Constants

#### `constants.ts` (`src/lib/constants.ts`)
- **Purpose**: Centralized configuration values
- **Contains**:
  - Chart color schemes
  - Attendance thresholds
  - Reusable configuration

## Benefits of Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused across the application
3. **Maintainability**: Smaller, focused components are easier to maintain
4. **Testability**: Isolated components are easier to test
5. **Performance**: Better code splitting and lazy loading opportunities
6. **Developer Experience**: Clearer structure makes development faster

## Usage Example

```tsx
import { DashboardClient } from "@/components/DashboardClient";

function DashboardPage({ data, defaultMonth, availableSources }) {
  return (
    <DashboardClient
      data={data}
      defaultMonth={defaultMonth}
      availableSources={availableSources}
    />
  );
}
```

## File Organization

```
src/
├── components/
│   ├── charts/
│   │   ├── DailyAttendanceChart.tsx
│   │   ├── SourcesDistributionChart.tsx
│   │   └── index.ts
│   ├── tables/
│   │   ├── SourcesDetailsTable.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── DashboardContent.tsx
│   │   └── index.ts
│   └── DashboardClient.tsx
├── hooks/
│   └── useDashboardState.ts
└── lib/
    └── constants.ts
```

## Future Enhancements

- Add TypeScript interfaces for all component props
- Implement error boundaries for better error handling
- Add unit tests for each component
- Consider implementing React.memo for performance optimization
- Add loading states and skeleton components

# ft_dashboard

A modern, interactive dashboard for 42 students to view and analyze their attendance data. Built with Next.js 15, TypeScript, and shadcn/ui with a focus on performance, caching, and user experience.

## ✨ Features

### 🔐 Authentication & Security
- **42 Session-based Authentication**: Secure login using 42 session cookies
- **Automatic Session Validation**: Middleware validates sessions on every request
- **Protected Routes**: Automatic redirection to login for unauthenticated users
- **Privacy-First**: Cache is automatically cleared on logout
- **Enhanced Cookie Management**: Smart cookie expiration and cleanup
- **Security Headers**: Proper CORS and security configurations

### 📊 Dashboard Features
- **Real-time Attendance Data**: Fetched from 42 Paris Dashboard API
- **Interactive Charts**: Daily attendance trends with Recharts
- **Attendance Calendar**: Visual calendar view with daily attendance details and session breakdown
- **Enhanced Summary Cards**:
  - **Remaining Hours**: Shows remaining hours and workdays left with progress tracking
  - **Total Hours**: Combined work and holiday hours with precise progress bars
  - **Holidays**: Annual allowance tracking (35 days) with progress visualization
- **Monthly Navigation**: Easy switching between different attendance periods
- **Session Details**: Detailed view of individual sessions by day with source breakdown
- **Responsive Design**: Optimized for all device sizes

### ⚡ Performance & Caching
- **Client-Side Caching**: 5-minute cache duration for instant dashboard loads
- **Manual Data Refresh**: Refresh button in header dropdown
- **Cache Status Indicator**: Shows when data was last updated
- **Optimistic UI**: Instant feedback with background data updates
- **Smart Loading States**: Realistic skeleton components matching actual layout
- **Intersection Observer**: Lazy loading for performance-heavy components

### 🎨 User Experience
- **Modern Glass Morphism UI**: Beautiful, modern interface with glass effects
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode Support**: Automatic theme detection with next-themes
- **Loading States**: Smooth loading animations and realistic skeletons
- **Error Handling**: Graceful error pages and user-friendly messages
- **Interactive Background**: Dynamic background effects with mouse tracking
- **Progress Visualization**: Color-coded progress bars for all metrics
- **Accessibility**: Proper ARIA labels and keyboard navigation

### 🍪 Cookie Management
- **Smart Expiration**: Holiday cookies automatically expire at month end
- **Complete Cleanup**: All user cookies cleared on logout
- **Enhanced Security**: Comprehensive cookie deletion across domains
- **User Privacy**: Automatic cleanup prevents data persistence
- **Cross-Domain Support**: Handles different domain scenarios

## 🛠 Tech Stack

### Frontend
- **Next.js 15.3.5** - React framework with App Router and Turbopack
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development with strict configuration
- **Tailwind CSS 4** - Utility-first CSS framework with custom animations
- **shadcn/ui** - Modern component library with Radix UI primitives
- **Recharts 3.1.0** - Interactive charts and visualizations
- **Lucide React 0.525.0** - Beautiful icons
- **date-fns 4.1.0** - Date manipulation utilities
- **react-day-picker 9.8.0** - Calendar component

### Backend & API
- **Next.js API Routes** - Server-side API endpoints
- **42 Paris Dashboard API** - Attendance data source
- **Session-based Authentication** - Secure cookie-based auth
- **Middleware** - Request validation and routing

### Development Tools
- **ESLint 9.31.0** - Code linting and quality
- **Turbopack** - Fast development builds
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking
- **tw-animate-css 1.3.5** - Custom animation utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Valid 42 session cookie

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:pquline/ft_dashboard.git
   cd ft_dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Authentication Setup

1. **Get your session cookie:**
   - Go to [42 Dashboard](https://dashboard.42paris.fr/attendance)
   - Open Developer Tools (F12)
   - Navigate to Application/Storage → Cookies
   - Copy the value of the "session" cookie

2. **Login to ft_dashboard:**
   - Visit the login page
   - Paste your session cookie
   - Click "Login"

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── attendance/    # Attendance data endpoint
│   ├── login/             # Authentication page
│   ├── legal/             # Privacy and terms pages
│   ├── error-demo/        # Error demonstration
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── charts/           # Chart components
│   │   ├── DailyAttendanceChart.tsx
│   │   └── index.ts
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── DashboardContent.tsx
│   │   └── index.ts
│   ├── layout/           # Layout components
│   │   ├── DashboardLayout.tsx
│   │   └── index.ts
│   ├── ui/               # shadcn/ui components
│   ├── AttendanceCalendar.tsx
│   ├── AttendanceHeatmapCard.tsx (disabled)
│   ├── DashboardSummaryCards.tsx
│   ├── DashboardSkeleton.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── hooks/                # Custom React hooks
│   ├── useCachedData.ts  # Data caching logic
│   ├── useDashboardState.ts # Dashboard state management
│   └── useInteractiveBackground.ts # Background effects
├── lib/                  # Utilities and constants
│   ├── constants.ts      # App constants
│   └── utils.ts          # Utility functions and cookie management
├── types/                # TypeScript type definitions
│   └── attendance.ts     # Attendance data types
└── middleware.ts         # Authentication middleware
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the existing code style
3. **Use conventional commits** for commit messages
4. **Open a pull request** with a clear description

### Commit Convention
```
type(scope): description

feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [42 Paris Dashboard](https://dashboard.42paris.fr/attendance) - Source of attendance data
- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Recharts](https://recharts.org/) - Chart library

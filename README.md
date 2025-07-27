# ft_dashboard

A modern, interactive dashboard for 42 students to view and analyze their attendance data. Built with Next.js 15, TypeScript, and shadcn/ui with a focus on performance, caching, and user experience.

## ✨ Features

### 🔐 Authentication & Security
- **42 Session-based Authentication**: Secure login using 42 session cookies
- **Automatic Session Validation**: Middleware validates sessions on every request
- **Protected Routes**: Automatic redirection to login for unauthenticated users
- **Privacy-First**: Cache is automatically cleared on logout

### 📊 Dashboard Features
- **Real-time Attendance Data**: Fetched from 42 Paris Dashboard API
- **Interactive Charts**: Daily attendance trends with Recharts
- **Attendance Calendar**: Visual calendar view with daily attendance details
- **Attendance Heatmap**: Color-coded heatmap showing attendance patterns
- **Summary Cards**: Quick overview of total, on-site, and off-site attendance
- **Monthly Navigation**: Easy switching between different attendance periods

### ⚡ Performance & Caching
- **Client-Side Caching**: 5-minute cache duration for instant dashboard loads
- **Manual Data Refresh**: Refresh button in header dropdown
- **Cache Status Indicator**: Shows when data was last updated
- **Optimistic UI**: Instant feedback with background data updates

### 🎨 User Experience
- **Modern Glass Morphism UI**: Beautiful, modern interface with glass effects
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode Support**: Automatic theme detection
- **Loading States**: Smooth loading animations and skeletons
- **Error Handling**: Graceful error pages and user-friendly messages

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Recharts** - Interactive charts and visualizations
- **Lucide React** - Beautiful icons

### Backend & API
- **Next.js API Routes** - Server-side API endpoints
- **42 Paris Dashboard API** - Attendance data source
- **Session-based Authentication** - Secure cookie-based auth

### Development Tools
- **ESLint** - Code linting and quality
- **Turbopack** - Fast development builds
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Valid 42 session cookie

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
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
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx            # Feature components
├── hooks/                # Custom React hooks
│   ├── useCachedData.ts  # Data caching logic
│   ├── useDashboardState.ts # Dashboard state management
│   └── useInteractiveBackground.ts # Background effects
├── lib/                  # Utilities and constants
│   ├── constants.ts      # App constants
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
│   └── attendance.ts     # Attendance data types
└── middleware.ts         # Authentication middleware
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📊 Data Structure

The dashboard displays attendance data with the following structure:

- **Total Attendance**: Combined on-site and off-site hours
- **On-site Attendance**: Physical presence at campus
- **Off-site Attendance**: Remote work/study hours
- **Daily Breakdown**: Hour-by-hour attendance for each day
- **Monthly Periods**: Organized by academic periods

## 🎯 Key Features Explained

### Caching System
- Data is cached in the browser for 5 minutes
- Instant dashboard loads from cache
- Manual refresh available via header dropdown
- Cache status indicator shows last update time

### Interactive Charts
- **Daily Attendance Chart**: Line chart showing daily trends
- **Attendance Heatmap**: Color-coded calendar view
- **Summary Cards**: Quick statistics overview

### Authentication Flow
1. User provides 42 session cookie
2. Middleware validates session on each request
3. Invalid sessions redirect to login
4. Valid sessions access dashboard

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the existing code style
3. **Use conventional commits** for commit messages
4. **Update the CHANGELOG.md** with your changes
5. **Open a pull request** with a clear description

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

## 📈 Version History

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and releases.

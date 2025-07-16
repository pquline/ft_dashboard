# ft_dashboard

A modern dashboard application for 42 students to view their attendance data. Built with Next.js 15, TypeScript, and shadcn/ui components.

## Features

- **Authentication**: Session-based authentication using 42 API session cookies
- **Client-side Caching**: Attendance data is cached in the browser for 5 minutes, enabling instant reloads and reduced API calls
- **Manual Data Refresh**: Users can manually refresh their data at any time via the header dropdown menu
- **Cache Status Indicator**: The dashboard displays whether data is cached or fresh, and when it was last updated
- **Privacy on Logout**: Cached attendance data is cleared when you log out
- **Modern UI**: Clean, responsive design using shadcn/ui components
- **Interactive Charts**: Data visualization using Recharts
- **Loading States**: Skeleton loading components for better UX
- **Protected Routes**: Middleware-based route protection

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- 42 account with API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ft_dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Authentication Setup

To access the dashboard, you need to authenticate with your 42 session:

1. Go to [dashboard.42paris.fr/](https://dashboard.42paris.fr/) and log in to your account
2. Open your browser's developer tools (F12)
3. Go to the Application/Storage tab
4. Find the session cookie
5. Copy the cookie value
6. Go to the login page in the dashboard
7. Paste the session cookie value and submit

The dashboard will then fetch your data from the 42 API using your session.

## Caching & Refresh

- Attendance data is cached in the browser (localStorage) for 5 minutes.
- On page reload, cached data is used for instant loading if still valid.
- Users can manually refresh data from the header dropdown menu.
- The dashboard shows cache status and last updated time.
- **Cached attendance data is automatically cleared when you log out, ensuring your data is not accessible to future users on the same device.**

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard page
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── CachedDashboardClient.tsx # Main dashboard client with caching logic
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
│   └── useCachedData.ts    # Client-side caching hook
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Routes

- `/api/auth/logout` - Logout endpoint to clear session

## Middleware

The application includes middleware that:
- Protects dashboard routes from unauthenticated access
- Redirects unauthenticated users to the login page
- Handles session validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

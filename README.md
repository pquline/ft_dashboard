# ft_dashboard

A modern dashboard for 42 students to view their attendance data. Built with Next.js, TypeScript, and shadcn/ui.

## Features

- Authentication with 42 session cookies
- Fast client-side caching and manual data refresh
- Modern, responsive UI with interactive charts

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS & shadcn/ui
- Recharts

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   git clone <repository-url>
   cd ft_dashboard
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

> You need a valid 42 session cookie to use the dashboard.

## Project Structure

```
src/
├── app/            # App routes and pages
├── components/     # UI and dashboard components
├── hooks/          # Custom React hooks
├── lib/            # Utilities
└── types/          # TypeScript types
```

## License

MIT

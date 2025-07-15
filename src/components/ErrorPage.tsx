import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  RefreshCw,
  Search,
  Shield,
  WifiOff,
} from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  code?: number;
  title?: string;
  description?: string;
  showRetry?: boolean;
  showHome?: boolean;
  customActions?: React.ReactNode;
}

const errorConfigs = {
  400: {
    icon: AlertTriangle,
    title: "Bad Request",
    description:
      "The request could not be processed. Please check your input and try again.",
    color: "bg-orange-500/10 text-orange-500",
  },
  401: {
    icon: Shield,
    title: "Unauthorized",
    description: "You need to be logged in to access this page.",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  403: {
    icon: Shield,
    title: "Forbidden",
    description: "You don't have permission to access this resource.",
    color: "bg-red-500/10 text-red-500",
  },
  404: {
    icon: Search,
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    color: "bg-blue-500/10 text-blue-500",
  },
  500: {
    icon: AlertTriangle,
    title: "Internal Server Error",
    description: "Something went wrong on our end. Please try again later.",
    color: "bg-red-500/10 text-red-500",
  },
  503: {
    icon: WifiOff,
    title: "Service Unavailable",
    description:
      "The service is temporarily unavailable. Please try again later.",
    color: "bg-orange-500/10 text-orange-500",
  },
  default: {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    color: "bg-red-500/10 text-red-500",
  },
};

export default function ErrorPage({
  code = 500,
  title,
  description,
  showRetry = true,
  showHome = true,
  customActions,
}: ErrorPageProps) {
  const config =
    errorConfigs[code as keyof typeof errorConfigs] || errorConfigs.default;
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader className="space-y-4">
          <div
            className={`mx-auto w-10 h-10 ${config.color} rounded-full flex items-center justify-center`}
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            <p>Error {code}</p>
          </CardTitle>
          <CardDescription className="text-foreground">
            {title || config.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {description || config.description}
          </div>
          {customActions ? (
            customActions
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              {showRetry && (
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              {showHome && (
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Go Home</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

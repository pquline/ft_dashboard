import Link from "next/link";
import { Heart, Github, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="glass border-t border-border/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-mono">
              <span className="text-primary">$</span> ./made with{" "}
              <Heart className="inline h-3 w-3 text-red-500 fill-current animate-pulse-slow" />
              {" "}on{" "}
              <Link
                href="https://github.com/pquline/ft_dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-1 group"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:underline">GitHub</span>
              </Link>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
              <span>Live Dashboard</span>
            </div>
            <div className="w-px h-4 bg-border/50"></div>
            <span>42 Paris</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

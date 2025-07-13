import Link from "next/link";
import { Heart, Github, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="glass border-t border-border/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="font-mono">
              <span className="text-primary">{"$>"}</span> ./made with{" "}
              <span className="text-red-500">{"<3"}</span>{" "}
              on{" "}
              <Link
                href="https://github.com/pquline/ft_dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors duration-200 group inline-flex items-center gap-1"
              >
                <span className="group-hover:underline">GitHub</span>
              </Link>
              <span className="text-yellow-500 animate-pulse">{" █"}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

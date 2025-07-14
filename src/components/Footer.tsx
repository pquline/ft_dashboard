import Link from "next/link";

export function Footer() {
  return (
    <footer className="shadow-2xl rounded-t-2xl mt-12 border-t border-white/10 bg-white/30 dark:bg-[rgba(24,28,40,0.18)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-foreground/80">
            <span className="font-mono">
              <span className="text-primary">{"$>"}</span> ./made with{' '}<span className="text-red-500 mx-1">{"<3"}{' '}</span>by{' '}
              <Link
                href="https://github.com/pquline"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline transition-colors duration-200 group inline-flex items-center gap-1"
              >
                <span>pfischof</span>
              </Link>
              <span className="text-yellow-500 animate-pulse">{" █"}</span>
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/legal/privacy"
              className="text-foreground/90 hover:text-primary transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-foreground/90 hover:text-primary transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

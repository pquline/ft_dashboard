import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Cookie, FileText, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
  const legalPages = [
    {
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information',
      icon: Shield,
      href: '/legal/privacy',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Terms of Service',
      description: 'Understand the terms and conditions for using our dashboard',
      icon: FileText,
      href: '/legal/terms',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      title: 'Cookie Policy',
      description: 'Information about how we use cookies and similar technologies',
      icon: Cookie,
      href: '/legal/cookies',
      color: 'from-green-500/20 to-emerald-500/20'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg interactive-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
            Legal Information
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
            Important legal documents and policies that govern your use of ft_dashboard
          </p>
        </div>

        {/* Legal Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {legalPages.map((page, index) => (
            <Link key={page.href} href={page.href} className="group">
              <Card className="card-modern h-full group-hover:scale-105 transition-all duration-300 animate-fade-in-up">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${page.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <page.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                    {page.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4">
                    {page.description}
                  </CardDescription>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Information */}
        <div className="glass rounded-2xl p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Questions or Concerns?
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about our legal policies or need clarification on any terms,
            please don't hesitate to reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="https://github.com/pquline/ft_dashboard/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              Contact Support
            </Link>
            <Link
              href="/"
              className="btn-glass inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

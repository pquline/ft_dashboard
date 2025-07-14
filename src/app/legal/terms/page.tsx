import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, CheckCircle, FileText, Scale, Users } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Service Overview',
      icon: CheckCircle,
      content: [
        'ft_dashboard is a bridge service connecting your browser to 42 Paris API',
        'We do not collect, store, or process any user data',
        'Service is provided free of charge and "as is"',
        'You must have a valid 42 Paris account to use this service'
      ]
    },
    {
      title: 'How It Works',
      icon: Users,
      content: [
        'Your browser stores a session cookie locally for 24 hours',
        'This cookie authenticates with 42 Paris API on your behalf',
        'Data is fetched and displayed temporarily in your browser',
        'No data is stored on our servers or infrastructure'
      ]
    },
    {
      title: 'User Responsibilities',
      icon: AlertTriangle,
      content: [
        'Provide a valid session cookie from 42 Paris dashboard',
        'Use the service only for lawful purposes',
        'Comply with 42 Paris terms of service',
        'Report any security concerns immediately'
      ]
    },
    {
      title: 'Service Limitations',
      icon: Scale,
      content: [
        'Service availability depends on 42 Paris API',
        'No data is collected or stored by our service',
        'Session expires after 24 hours automatically',
        'Service provided without warranties or guarantees'
      ]
    }
  ];

  return (
    <div className="min-h-screen gradient-bg interactive-bg">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
        <div className="mb-8">
          <Button asChild className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10 mb-6">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <FileText className="w-12 h-12 text-foreground" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="text-foreground/90">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="card-modern glass-hover group overflow-hidden mb-8">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/80">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              These Terms of Service ("Terms") govern your use of ft_dashboard ("Service"), a bridge application
              that connects your browser to the 42 Paris API for attendance data visualization.
            </p>
            <p>
              By using our Service, you agree to these Terms. We do not collect, store, or process any data.
              This service simply facilitates communication between your browser and 42 Paris.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="card-modern glass-hover group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold text-foreground/80">{section.title}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <section.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Sections */}
        <Card className="card-modern glass-hover group overflow-hidden mt-8">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/80">Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              The Service and its original content, features, and functionality are the property of ft_dashboard.
              The Service is protected by copyright and other applicable laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works of our Service without permission.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern glass-hover group overflow-hidden mt-8">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/80">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              The service is provided free of charge and "as is" without any warranties.
            </p>
            <p>
              We are not liable for any damages arising from the use of this service.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern glass-hover group overflow-hidden mt-8">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/80">Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              You may stop using the service at any time by clearing your browser cookies.
            </p>
            <p>
              Since we do not store any data, there is no account to terminate or suspend.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern glass-hover group overflow-hidden mt-8">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/80">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              If you have any questions about these Terms of Service or how our service works, please contact us via <Link href="mailto:dashboard@pfischof.com" className="text-primary hover:underline">email</Link>.
            </p>
          </CardContent>
        </Card>

                {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border/50">
          <Button asChild className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10">
            <Link href="/legal/privacy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Privacy Policy
            </Link>
          </Button>
          <Button asChild className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10">
            <Link href="/">
              Back to Dashboard
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

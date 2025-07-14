import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, Lock, Shield, User } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: User,
      content: [
        'Session cookie from 42 Paris dashboard for authentication',
        'Attendance data fetched from 42 Paris API',
        'User profile information (login, image) from 42 Paris',
        'No personal data is stored on our servers'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'Authenticate users with 42 Paris dashboard',
        'Fetch and display attendance analytics',
        'Provide attendance tracking and visualization',
        'No usage analytics or tracking is performed'
      ]
    },
    {
      title: 'Data Protection',
      icon: Lock,
      content: [
        'Session cookies are encrypted and secure',
        'All API requests use HTTPS encryption',
        'No data is stored permanently on our servers',
        'Session data expires after 24 hours'
      ]
    },
    {
      title: 'Data Retention',
      icon: Calendar,
      content: [
        'Session cookies expire after 24 hours',
        'No data is retained after session expiration',
        'No analytics or usage data is collected',
        'No backup or permanent storage of user data'
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
            <Shield className="w-12 h-12 text-foreground" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Privacy Policy
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
        <Card className="card-modern mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              At ft_dashboard, we are committed to protecting your privacy. This Privacy Policy explains how we handle your information
              when you use our attendance dashboard service, which connects to the 42 Paris API.
            </p>
            <p>
              We do not collect, store, or process any personal data on our servers. All data is fetched directly from 42 Paris
              and displayed temporarily in your browser. Your session information is only stored in a secure cookie that expires after 24 hours.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="card-modern">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <section.icon className="w-6 h-6 text-foreground" />
                  <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
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
        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              Since we do not store any personal data on our servers, there is no personal information to access, correct, or delete.
              All your data remains under the control of 42 Paris and is subject to their privacy policy.
            </p>
            <p>
              You can revoke access to your data at any time by clearing your browser cookies or logging out of the application.
              Your session will automatically expire after 24 hours of inactivity.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us via <Link href="mailto:dashboard@pfischof.com" className="text-primary hover:underline">email</Link>.
            </p>
          </CardContent>
        </Card>

                {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border/50">
          <Button asChild className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10">
            <Link href="/legal/terms">
              Terms of Service
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

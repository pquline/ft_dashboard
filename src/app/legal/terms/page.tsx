import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, CheckCircle, FileText, Scale, Users } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing and using ft_dashboard, you accept and agree to be bound by these terms',
        'If you do not agree to these terms, you must not use our service',
        'We reserve the right to modify these terms at any time',
        'Continued use after changes constitutes acceptance of new terms'
      ]
    },
    {
      title: 'Use of Service',
      icon: Users,
      content: [
        'You must use the service only for lawful purposes',
        'You are responsible for maintaining the security of your account',
        'You must not attempt to gain unauthorized access to the system',
        'You must not interfere with or disrupt the service'
      ]
    },
    {
      title: 'User Responsibilities',
      icon: AlertTriangle,
      content: [
        'Provide accurate and complete information when required',
        'Maintain the confidentiality of your login credentials',
        'Report any security concerns immediately',
        'Comply with all applicable laws and regulations'
      ]
    },
    {
      title: 'Service Availability',
      icon: Scale,
      content: [
        'We strive to maintain high availability but cannot guarantee 100% uptime',
        'We may perform maintenance that temporarily affects service availability',
        'We are not liable for any damages caused by service interruptions',
        'We will provide reasonable notice for planned maintenance'
      ]
    }
  ];

  return (
    <div className="min-h-screen gradient-bg interactive-bg">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
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
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              These Terms of Service ("Terms") govern your use of ft_dashboard ("Service"), a dashboard application
              that provides attendance tracking and analytics for educational institutions.
            </p>
            <p>
              By using our Service, you agree to these Terms. If you disagree with any part of these terms,
              then you may not access the Service.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="card-modern">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{item}</span>
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
            <CardTitle className="text-xl font-semibold">Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property
              of ft_dashboard and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
              republish, download, store, or transmit any of the material on our Service.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              In no event shall ft_dashboard, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
            <p>
              Our liability is limited to the amount you paid for the Service, if any, or $100, whichever is greater.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever and without limitation.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue using the Service. All provisions of
              the Terms which by their nature should survive termination shall survive termination.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2">
              <p>• GitHub: <Link href="https://github.com/pquline/ft_dashboard" className="text-primary hover:underline">github.com/pquline/ft_dashboard</Link></p>
              <p>• Issues: <Link href="https://github.com/pquline/ft_dashboard/issues" className="text-primary hover:underline">Create an issue</Link></p>
            </div>
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

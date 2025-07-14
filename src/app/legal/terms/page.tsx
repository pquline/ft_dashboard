import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        'You must have a valid 42 Paris account to access the service',
        'You must not attempt to gain unauthorized access to the system',
        'You must not interfere with or disrupt the service'
      ]
    },
    {
      title: 'User Responsibilities',
      icon: AlertTriangle,
      content: [
        'Provide a valid session cookie from 42 Paris dashboard',
        'Maintain the confidentiality of your session information',
        'Report any security concerns immediately',
        'Comply with 42 Paris terms of service and applicable laws'
      ]
    },
    {
      title: 'Service Availability',
      icon: Scale,
      content: [
        'Service availability depends on 42 Paris API accessibility',
        'We may perform maintenance that temporarily affects service availability',
        'We are not liable for any damages caused by service interruptions',
        'Service is provided "as is" without warranties'
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
        <Card className="card-modern mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              These Terms of Service ("Terms") govern your use of ft_dashboard ("Service"), a dashboard application
              that provides attendance tracking and visualization by connecting to the 42 Paris API.
            </p>
            <p>
              By using our Service, you agree to these Terms and acknowledge that this service is a third-party
              application that accesses data from 42 Paris. If you disagree with any part of these terms,
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
            <CardTitle className="text-xl font-semibold">Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property
              of ft_dashboard. The Service is protected by copyright and other laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
              republish, download, store, or transmit any of the material on our Service without permission.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              In no event shall ft_dashboard, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
            <p>
              Our liability is limited to the amount you paid for the Service, if any, or $100, whichever is greater.
              The service is provided free of charge and "as is" without any warranties.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
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
          <CardContent className="space-y-4 text-foreground/90">
            <p>
              If you have any questions about these Terms of Service, please contact us via <Link href="mailto:dashboard@pfischof.com" className="text-primary hover:underline">email</Link>.
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

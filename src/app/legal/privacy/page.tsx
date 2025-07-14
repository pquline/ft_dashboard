import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Eye, Lock, Shield, User } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: User,
      content: [
        'Personal information (login credentials, profile data)',
        'Usage data and analytics',
        'Session information and cookies',
        'Device and browser information'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'Provide and maintain the dashboard service',
        'Analyze usage patterns and improve functionality',
        'Ensure security and prevent fraud',
        'Communicate with you about service updates'
      ]
    },
    {
      title: 'Data Protection',
      icon: Lock,
      content: [
        'Encryption of sensitive data in transit and at rest',
        'Regular security audits and updates',
        'Limited access to personal information',
        'Compliance with data protection regulations'
      ]
    },
    {
      title: 'Data Retention',
      icon: Calendar,
      content: [
        'Session data is retained only during active sessions',
        'Analytics data is anonymized and retained for 12 months',
        'Account data is retained until account deletion',
        'Backup data is retained for 30 days'
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Privacy Policy
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
              At ft_dashboard, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our dashboard service.
            </p>
            <p>
              By using ft_dashboard, you agree to the collection and use of information in accordance with this policy.
              We will not use or share your information with anyone except as described in this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="card-modern">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
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
            <CardTitle className="text-xl font-semibold">Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              You have the right to access, correct, or delete your personal information. You can also request a copy of your data
              or withdraw your consent at any time by contacting us through our support channels.
            </p>
            <p>
              We will respond to your requests within 30 days and will not charge you for reasonable requests to access,
              correct, or delete your personal information.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p>• Email: Through our GitHub repository issues</p>
              <p>• GitHub: <Link href="https://github.com/pquline/ft_dashboard" className="text-primary hover:underline">github.com/pquline/ft_dashboard</Link></p>
            </div>
          </CardContent>
        </Card>

                {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border/50">
          <Link
            href="/"
            className="btn-glass inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus-ring"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <Link
            href="/legal/terms"
            className="btn-glass inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus-ring"
          >
            Terms of Service
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Cookie, Database, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      title: 'Essential Cookies',
      icon: Shield,
      description: 'These cookies are necessary for the website to function properly',
      examples: [
        'Session management cookies',
        'Authentication cookies',
        'Security cookies',
        'Load balancing cookies'
      ],
      duration: 'Session or up to 1 year'
    },
    {
      title: 'Analytics Cookies',
      icon: Database,
      description: 'These cookies help us understand how visitors interact with our website',
      examples: [
        'Page view tracking',
        'User behavior analysis',
        'Performance monitoring',
        'Error tracking'
      ],
      duration: 'Up to 2 years'
    },
    {
      title: 'Preference Cookies',
      icon: Settings,
      description: 'These cookies remember your preferences and settings',
      examples: [
        'Theme preferences (light/dark mode)',
        'Language settings',
        'Display preferences',
        'User interface customizations'
      ],
      duration: 'Up to 1 year'
    },
    {
      title: 'Session Cookies',
      icon: Clock,
      description: 'These cookies are temporary and are deleted when you close your browser',
      examples: [
        'Login session data',
        'Form data during submission',
        'Temporary user preferences',
        'Shopping cart information'
      ],
      duration: 'Browser session only'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg interactive-bg">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/legal"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Legal Information
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Cookie className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Cookie Policy
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
            <CardTitle className="text-xl font-semibold">What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience by remembering your preferences and
              analyzing how you use our site.
            </p>
            <p>
              This Cookie Policy explains how we use cookies and similar technologies on ft_dashboard,
              what types of cookies we use, and how you can manage them.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Types of Cookies We Use</h2>
          {cookieTypes.map((type, index) => (
            <Card key={index} className="card-modern">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">{type.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{type.duration}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{type.description}</p>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {type.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cookie Management */}
        <Card className="card-modern mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Managing Your Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              You have several options for managing cookies on our website:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground">Browser Settings</p>
                  <p className="text-sm">You can control cookies through your browser settings. Most browsers allow you to block or delete cookies.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground">Third-Party Tools</p>
                  <p className="text-sm">You can use browser extensions or third-party tools to manage cookies more granularly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-foreground">Opt-Out</p>
                  <p className="text-sm">You can opt out of non-essential cookies, though this may affect your experience.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="card-modern mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may use third-party services that also place cookies on your device. These services include:
            </p>
            <div className="space-y-2">
              <p>• <strong>Analytics services</strong> - to understand how our website is used</p>
              <p>• <strong>Authentication services</strong> - to manage user sessions</p>
              <p>• <strong>Content delivery networks</strong> - to improve website performance</p>
            </div>
            <p>
              These third-party cookies are subject to their respective privacy policies,
              which we encourage you to review.
            </p>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card className="card-modern mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for other operational, legal, or regulatory reasons.
            </p>
            <p>
              When we make changes, we will update the "Last updated" date at the top of this policy.
              We encourage you to review this policy periodically.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="card-modern mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="space-y-2">
              <p>• GitHub: <Link href="https://github.com/pquline/ft_dashboard" className="text-primary hover:underline">github.com/pquline/ft_dashboard</Link></p>
              <p>• Issues: <Link href="https://github.com/pquline/ft_dashboard/issues" className="text-primary hover:underline">Create an issue</Link></p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border/50">
          <Link
            href="/legal/terms"
            className="btn-glass inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terms of Service
          </Link>
          <Link
            href="/legal"
            className="btn-glass inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          >
            Back to Legal
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}

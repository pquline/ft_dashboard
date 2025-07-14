import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Eye, Lock, Shield, User } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "No Data Collection",
      icon: User,
      content: [
        "We do not collect, store, or process any personal data",
        "Session cookies are stored locally in your browser only",
        "All data is fetched directly from 42 Paris API",
        "No information is transmitted to or stored on our servers",
      ],
    },
    {
      title: "How the Service Works",
      icon: Eye,
      content: [
        "Your browser stores a session cookie locally for 24 hours",
        "This cookie is used to authenticate with 42 Paris API",
        "Data is fetched and displayed temporarily in your browser",
        "No data is collected, analyzed, or stored by our service",
      ],
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "All communication with 42 Paris uses HTTPS encryption",
        "Session cookies are secure and expire automatically",
        "No data is stored on our servers or infrastructure",
        "Your data remains under 42 Paris control at all times",
      ],
    },
    {
      title: "Data Retention",
      icon: Calendar,
      content: [
        "Session cookies expire after 24 hours automatically",
        "No data is retained after your browser session ends",
        "No logs, analytics, or tracking data is collected",
        "No personal information is ever stored on our systems",
      ],
    },
  ];

  return (
    <div className="min-h-screen gradient-bg interactive-bg">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            asChild
            className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10 mb-6"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-10 h-10 text-foreground" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-foreground/90">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="card-modern glass-hover group overflow-hidden mb-8">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/80">
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              At ft_dashboard, we are committed to protecting your privacy. This
              Privacy Policy explains how our service works and why we do not
              collect, store, or process any of your personal data.
            </p>
            <p>
              Our service acts as a bridge between your browser and the 42 Paris
              API. We do not collect, store, or process any data. All
              information is fetched directly from 42 Paris and displayed
              temporarily in your browser. Your session cookie is stored locally
              and expires after 24 hours.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card
              key={index}
              className="card-modern glass-hover group overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold text-foreground/80">
                  {section.title}
                </CardTitle>
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
            <CardTitle className="text-sm font-semibold text-foreground/80">
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              Since we do not collect, store, or process any personal data,
              there is no information to access, correct, or delete. All your
              data remains under the control of 42 Paris and is subject to their
              privacy policy.
            </p>
            <p>
              You can revoke access at any time by clearing your browser cookies
              or logging out. Your session will automatically expire after 24
              hours, and no data will be retained by our service.
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern glass-hover group overflow-hidden mt-8">
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-semibold text-foreground/80">
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90 relative z-10">
            <p>
              If you have any questions about this Privacy Policy or how our
              service works, please contact us via{" "}
              <Link
                href="mailto:dashboard@pfischof.com"
                className="text-primary hover:underline"
              >
                email
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border/50">
          <Button
            asChild
            className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button
            asChild
            className="btn-glass font-semibold py-3 transition-all duration-300 focus-ring relative z-10"
          >
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

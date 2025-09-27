"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  IconMail,
  IconPhone,
  IconMessageCircle,
  IconBook,
  IconVideo,
  IconDownload,
  IconExternalLink,
  IconClock,
  IconMapPin,
  IconHelp,
  IconBug,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";
import { toast } from "sonner";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  type: "guide" | "video" | "download" | "link";
  url: string;
  icon: React.ReactNode;
};

export default function HelpSupportPage() {
  const [contactForm, setContactForm] = React.useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I create a new lead?",
      answer:
        "To create a new lead, navigate to the 'Add New Leads' section from the sidebar. Fill in the required customer information including name, contact details, product type, and priority score. Click 'Create Lead' to save.",
      category: "leads",
    },
    {
      id: "2",
      question: "How can I track my lead conversion rates?",
      answer:
        "Your conversion rates are automatically calculated and displayed in the Reports section. You can also view individual lead progress in the 'My Leads' or 'All Leads' sections depending on your role.",
      category: "reports",
    },
    {
      id: "3",
      question: "What are the different user roles in the system?",
      answer:
        "There are three main roles: Manager (can manage own leads), Admin (can view and manage all leads and managers), and Super Admin (full system access including user management and audit logs).",
      category: "account",
    },
    {
      id: "4",
      question: "How do I generate and download reports?",
      answer:
        "Go to the Reports section and click 'Generate PDF Report'. The system will create a comprehensive report of your leads data which you can preview and download as a PDF file.",
      category: "reports",
    },
    {
      id: "5",
      question: "Can I edit lead information after creation?",
      answer:
        "Yes, you can edit lead information by clicking on any lead in your leads list. Make the necessary changes and save. Note that some fields may be restricted based on your user role.",
      category: "leads",
    },
    {
      id: "6",
      question: "How do I reset my password?",
      answer:
        "Click on 'Forgot Password' on the login page, enter your registered email address, and follow the instructions sent to your email to reset your password.",
      category: "account",
    },
    {
      id: "7",
      question: "What should I do if I encounter a system error?",
      answer:
        "If you encounter any errors, please note the error message and contact support through this page. Include details about what you were doing when the error occurred for faster resolution.",
      category: "troubleshooting",
    },
    {
      id: "8",
      question: "How is lead distribution managed?",
      answer:
        "Lead distribution is managed by Admins and Super Admins. They can view how leads are assigned across team members and reassign leads as needed for optimal workload balance.",
      category: "leads",
    },
  ];

  const resources: Resource[] = [
    {
      id: "1",
      title: "User Guide - Getting Started",
      description:
        "Complete guide for new users covering all basic features and functionality.",
      type: "guide",
      url: "#",
      icon: <IconBook className="h-4 w-4" />,
    },
    {
      id: "2",
      title: "Lead Management Tutorial",
      description: "Step-by-step video tutorial on managing leads effectively.",
      type: "video",
      url: "#",
      icon: <IconVideo className="h-4 w-4" />,
    },
    {
      id: "3",
      title: "Quick Reference Card",
      description: "Downloadable PDF with keyboard shortcuts and quick tips.",
      type: "download",
      url: "#",
      icon: <IconDownload className="h-4 w-4" />,
    },
    {
      id: "4",
      title: "API Documentation",
      description: "Technical documentation for developers and integrations.",
      type: "link",
      url: "#",
      icon: <IconExternalLink className="h-4 w-4" />,
    },
    {
      id: "5",
      title: "Best Practices Guide",
      description: "Tips and strategies for maximizing lead conversion rates.",
      type: "guide",
      url: "#",
      icon: <IconBook className="h-4 w-4" />,
    },
    {
      id: "6",
      title: "Troubleshooting Common Issues",
      description: "Solutions to frequently encountered problems and errors.",
      type: "guide",
      url: "#",
      icon: <IconBug className="h-4 w-4" />,
    },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Support request submitted successfully! We'll get back to you within 24 hours.",
      );
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      });
    } catch (error) {
      console.error("Support request error:", error);
      toast.error("Failed to submit support request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "leads":
        return <IconUser className="h-4 w-4" />;
      case "reports":
        return <IconBook className="h-4 w-4" />;
      case "account":
        return <IconSettings className="h-4 w-4" />;
      case "troubleshooting":
        return <IconBug className="h-4 w-4" />;
      default:
        return <IconHelp className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Help &amp; Support
        </h2>
        <p className="text-muted-foreground">
          Find answers to your questions, access helpful resources, and get in
          touch with our support team.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Support</CardTitle>
            <IconMail className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">
              support@leadmanagement.com
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Response within 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Support</CardTitle>
            <IconPhone className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">
              +1 (555) 123-4567
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Mon-Fri, 9AM-6PM EST
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Chat</CardTitle>
            <IconMessageCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions about using the lead management
              system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <details key={faq.id} className="group rounded-lg border">
                  <summary className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 p-4 transition-colors">
                    {getCategoryIcon(faq.category)}
                    <span className="font-medium">{faq.question}</span>
                  </summary>
                  <div className="text-muted-foreground border-t px-4 pb-4 text-sm">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Can&apos;t find what you&apos;re looking for? Send us a message
              and we&apos;ll help you out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  value={contactForm.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="border-input bg-background focus:ring-ring mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="general">General Support</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject *
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("message", e.target.value)
                  }
                  required
                  className="border-input bg-background focus:ring-ring resize-vertical mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  rows={4}
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Helpful Resources</CardTitle>
          <CardDescription>
            Guides, tutorials, and documentation to help you get the most out of
            the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors"
                onClick={() =>
                  toast.info("Resource links would be configured in production")
                }
              >
                <div className="bg-primary/10 flex-shrink-0 rounded-md p-2">
                  {resource.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium">{resource.title}</h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {resource.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-primary text-xs capitalize">
                      {resource.type}
                    </span>
                    <IconExternalLink className="text-primary h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Office Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconClock className="h-4 w-4" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Monday - Friday:</span>
              <span className="text-sm font-medium">9:00 AM - 6:00 PM EST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Saturday:</span>
              <span className="text-sm font-medium">
                10:00 AM - 2:00 PM EST
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sunday:</span>
              <span className="text-sm font-medium">Closed</span>
            </div>
            <div className="border-t pt-2">
              <p className="text-muted-foreground text-xs">
                Emergency support available 24/7 for critical issues
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">System Status:</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Operational
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Last Update:</span>
              <span className="text-sm font-medium">Sept 27, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Version:</span>
              <span className="text-sm font-medium">v2.1.0</span>
            </div>
            <div className="border-t pt-2">
              <Button variant="outline" size="sm" className="w-full">
                View Status Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

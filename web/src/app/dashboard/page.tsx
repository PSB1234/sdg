"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconUsers,
  IconPlus,
  IconEye,
  IconFileText,
  IconChartBar,
  IconShare,
  IconShield,
  IconHelp,
  IconBrain,
  IconCheckbox,
  IconArrowRight,
  IconTrendingUp,
  IconTarget,
  IconClock,
} from "@tabler/icons-react";

type User = {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
};

type NavigationCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  children?: Array<{
    title: string;
    href: string;
    description: string;
  }>;
  color: string;
};

export default function Page() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api"}/auth/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const userData = (await response.json()) as { user: User };
          setCurrentUser(userData.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    void fetchUser();
  }, []);

  const navigationCards: NavigationCard[] = [
    {
      id: "leads",
      title: "Lead Management",
      description: "Manage and track your leads efficiently",
      href: "/dashboard/leads",
      icon: <IconUsers className="h-6 w-6" />,
      color: "bg-blue-500",
      children: [
        {
          title: "My Leads",
          href: "/dashboard/leads/my-leads",
          description: "View and manage your assigned leads",
        },
        {
          title: "All Leads",
          href: "/dashboard/leads/all-leads",
          description: "Complete lead database overview",
        },
        {
          title: "Add New Lead",
          href: "/dashboard/leads/add-new-leads",
          description: "Create new lead entries",
        },
      ],
    },
    {
      id: "reports",
      title: "Reports & Analytics",
      description: "Generate insights and performance reports",
      href: "/dashboard/reports",
      icon: <IconFileText className="h-6 w-6" />,
      color: "bg-green-500",
      children: [
        {
          title: "PDF Reports",
          href: "/dashboard/reports",
          description: "Generate and download comprehensive reports",
        },
      ],
    },

    {
      id: "lead-distribution",
      title: "Lead Distribution",
      description: "Monitor team lead assignments and performance",
      href: "/dashboard/lead-distribution",
      icon: <IconShare className="h-6 w-6" />,
      color: "bg-indigo-500",
      children: [],
    },
    {
      id: "audit-logs",
      title: "Audit Logs",
      description: "User activity and system audit trail",
      href: "/dashboard/audit-logs",
      icon: <IconShield className="h-6 w-6" />,
      color: "bg-red-500",
      children: [],
    },
    {
      id: "help-support",
      title: "Help & Support",
      description: "Get assistance and access resources",
      href: "/dashboard/help-and-support",
      icon: <IconHelp className="h-6 w-6" />,
      color: "bg-gray-500",
      children: [
        {
          title: "FAQs",
          href: "/dashboard/help-and-support#faqs",
          description: "Frequently asked questions",
        },
        {
          title: "Contact Support",
          href: "/dashboard/help-and-support#contact",
          description: "Get in touch with our support team",
        },
      ],
    },
  ];

  // Filter cards based on user role
  const getVisibleCards = () => {
    if (!currentUser) return navigationCards;

    const userRoles = currentUser.roles ?? [];
    const isManager = userRoles.includes("MANAGER");
    const isAdmin = userRoles.includes("ADMIN");
    const isSuperAdmin = userRoles.includes("SUPERADMIN");

    if (isManager && !isAdmin && !isSuperAdmin) {
      // Managers see limited access
      return navigationCards
        .filter((card) =>
          ["leads", "reports", "ai-insights", "tasks", "help-support"].includes(
            card.id,
          ),
        )
        .map((card) => {
          if (card.id === "leads") {
            return {
              ...card,
              children: card.children?.filter(
                (child) =>
                  child.href.includes("my-leads") ||
                  child.href.includes("add-new-leads"),
              ),
            };
          }
          return card;
        });
    }

    return navigationCards; // Admins and Super Admins see everything
  };

  const visibleCards = getVisibleCards();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{currentUser ? `, ${currentUser.name}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your lead management dashboard overview. Select a section
          to get started.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Access</CardTitle>
            <IconTarget className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visibleCards.length}</div>
            <p className="text-muted-foreground text-xs">Available sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <IconShield className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {currentUser?.roles?.includes("SUPERADMIN")
                ? "Super Admin"
                : currentUser?.roles?.includes("ADMIN")
                  ? "Admin"
                  : currentUser?.roles?.includes("MANAGER")
                    ? "Manager"
                    : "User"}
            </div>
            <p className="text-muted-foreground text-xs">Access level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <IconTrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">Online</div>
            <p className="text-muted-foreground text-xs">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <IconClock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Just now</div>
            <p className="text-muted-foreground text-xs">Real-time data</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Navigate to Sections</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <Link href={card.href}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`rounded-lg p-2 ${card.color} text-white`}>
                      {card.icon}
                    </div>
                    <IconArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {card.children && card.children.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        Quick Links:
                      </p>
                      <div className="space-y-1">
                        {card.children.slice(0, 3).map((child, index) => (
                          <div
                            key={index}
                            className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
                          >
                            <div className="h-1 w-1 rounded-full bg-current" />
                            <span>{child.title}</span>
                          </div>
                        ))}
                        {card.children.length > 3 && (
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <div className="h-1 w-1 rounded-full bg-current" />
                            <span>+{card.children.length - 3} more</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you might want to perform right away.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto justify-start p-4"
              asChild
            >
              <Link href="/dashboard/leads/add-new-leads">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <IconPlus className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Add New Lead</div>
                    <div className="text-muted-foreground text-xs">
                      Create a lead entry
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start p-4"
              asChild
            >
              <Link href="/dashboard/leads">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <IconEye className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">View Leads</div>
                    <div className="text-muted-foreground text-xs">
                      Browse lead database
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start p-4"
              asChild
            >
              <Link href="/dashboard/reports">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <IconChartBar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Generate Report</div>
                    <div className="text-muted-foreground text-xs">
                      Create PDF report
                    </div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start p-4"
              asChild
            >
              <Link href="/dashboard/help-and-support">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <IconHelp className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Get Help</div>
                    <div className="text-muted-foreground text-xs">
                      Support & guides
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

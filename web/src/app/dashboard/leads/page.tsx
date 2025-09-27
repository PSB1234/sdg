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
import Link from "next/link";
import {
  IconUsers,
  IconUserPlus,
  IconEye,
  IconPlus,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";

type LeadItem = {
  _id: string;
  customerName: string;
  productType: string;
  status: "New" | "In Progress" | "Converted" | "Dropped";
  priorityScore: number;
  assignedTo?: { name?: string } | null;
  lastUpdated?: string;
  creditScore?: number;
};

const leadCards = [
  {
    title: "My Leads",
    description: "View and manage leads assigned to you",
    icon: IconUsers,
    href: "/dashboard/leads/my-leads",
    color: "bg-blue-500/10 text-blue-500",
    stats: "Active assignments",
  },
  {
    title: "All Leads",
    description: "Browse all leads in the system",
    icon: IconEye,
    href: "/dashboard/leads/all-leads",
    color: "bg-green-500/10 text-green-500",
    stats: "System-wide view",
  },
  {
    title: "Add New Lead",
    description: "Create a new lead entry",
    icon: IconUserPlus,
    href: "/dashboard/leads/add-new-leads",
    color: "bg-purple-500/10 text-purple-500",
    stats: "Quick entry",
  },
];

export default function LeadsPage() {
  const [stats, setStats] = React.useState({
    recentActivity: { count: "-", subtext: "loading..." },
    conversionRate: { count: "-", subtext: "loading..." },
    priorityLeads: { count: "-", subtext: "loading..." },
  });
  const [loading, setLoading] = React.useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

  const fetchStats = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch recent activity (leads updated in last 24 hours)
      const [myLeadsRes, allLeadsRes] = await Promise.all([
        fetch(`${API_BASE}/leads/my`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
        fetch(`${API_BASE}/leads/all`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
      ]);

      let recentCount = 0;
      let totalLeads = 0;
      let convertedLeads = 0;
      let priorityLeads = 0;

      if (myLeadsRes.ok) {
        const myData = (await myLeadsRes.json()) as { leads: LeadItem[] };
        const myLeads = myData.leads ?? [];

        // Count leads updated in last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        recentCount = myLeads.filter((lead) => {
          const lastUpdated = lead.lastUpdated
            ? new Date(lead.lastUpdated)
            : new Date(0);
          return lastUpdated > yesterday;
        }).length;

        // Count priority leads (score > 70)
        priorityLeads = myLeads.filter(
          (lead) => lead.priorityScore > 70,
        ).length;
      }

      if (allLeadsRes.ok) {
        const allData = (await allLeadsRes.json()) as { leads: LeadItem[] };
        const allLeads = allData.leads ?? [];

        totalLeads = allLeads.length;
        convertedLeads = allLeads.filter(
          (lead) => lead.status === "Converted",
        ).length;
      }

      const conversionRate =
        totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

      setStats({
        recentActivity: {
          count: recentCount.toString(),
          subtext: "new updates",
        },
        conversionRate: {
          count: `${conversionRate}%`,
          subtext: "vs last month",
        },
        priorityLeads: {
          count: priorityLeads.toString(),
          subtext: "require attention",
        },
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats({
        recentActivity: { count: "0", subtext: "error loading" },
        conversionRate: { count: "0%", subtext: "error loading" },
        priorityLeads: { count: "0", subtext: "error loading" },
      });
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  React.useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const quickActions = [
    {
      title: "Recent Activity",
      description: "Last 24 hours",
      icon: IconClock,
      count: stats.recentActivity.count,
      subtext: stats.recentActivity.subtext,
    },
    {
      title: "Conversion Rate",
      description: "This month",
      icon: IconChartBar,
      count: stats.conversionRate.count,
      subtext: stats.conversionRate.subtext,
    },
    {
      title: "Priority Leads",
      description: "High priority",
      icon: IconPlus,
      count: stats.priorityLeads.count,
      subtext: stats.priorityLeads.subtext,
    },
  ];
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Leads Management
          </h2>
          <p className="text-muted-foreground">
            Manage your leads, track conversions, and drive growth.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {action.title}
              </CardTitle>
              <action.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="bg-muted h-8 w-16 animate-pulse rounded"></div>
                ) : (
                  action.count
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {action.subtext} • {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Action Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {leadCards.map((card) => (
          <Card
            key={card.title}
            className="group hover:border-primary/20 border-2 transition-all duration-200 hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    {card.stats}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-sm">
                {card.description}
              </p>
              <Button
                asChild
                className="group-hover:bg-primary group-hover:text-primary-foreground w-full"
              >
                <Link href={card.href}>Access {card.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChartBar className="h-5 w-5" />
            Lead Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium">Best Practices</h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Follow up within 24 hours of lead creation</li>
              <li>• Update lead status regularly</li>
              <li>• Use AI insights for prioritization</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Quick Navigation</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/leads/my-leads">My Leads</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/leads/all-leads">All Leads</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/leads/add-new-leads">New Lead</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

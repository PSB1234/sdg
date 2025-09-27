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
// Simple badge component
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  IconCreditCard,
  IconDownload,
  IconCalendar,
  IconCheck,
  IconX,
  IconClock,
  IconAlertTriangle,
  IconReceipt,
  IconCrown,
  IconTrendingUp,
  IconExternalLink,
} from "@tabler/icons-react";
import { toast } from "sonner";

type BillingInfo = {
  currentPlan: {
    name: string;
    type: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
    price: number;
    billingCycle: "monthly" | "yearly";
    features: string[];
    usageLimit: number;
    currentUsage: number;
  };
  paymentMethod: {
    type: "CARD" | "BANK" | null;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  billingHistory: Array<{
    id: string;
    date: string;
    amount: number;
    status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
    description: string;
    invoiceUrl?: string;
  }>;
  nextBilling?: {
    date: string;
    amount: number;
  };
};

const plans = [
  {
    name: "Free",
    type: "FREE" as const,
    price: 0,
    billingCycle: "monthly" as const,
    features: [
      "Up to 50 leads per month",
      "Basic reporting",
      "Email support",
      "2 team members",
    ],
    usageLimit: 50,
    popular: false,
  },
  {
    name: "Basic",
    type: "BASIC" as const,
    price: 29,
    billingCycle: "monthly" as const,
    features: [
      "Up to 500 leads per month",
      "Advanced reporting",
      "Priority email support",
      "10 team members",
      "Export to PDF/Excel",
    ],
    usageLimit: 500,
    popular: false,
  },
  {
    name: "Premium",
    type: "PREMIUM" as const,
    price: 99,
    billingCycle: "monthly" as const,
    features: [
      "Up to 2,000 leads per month",
      "Advanced analytics",
      "Phone & email support",
      "25 team members",
      "Custom integrations",
      "API access",
    ],
    usageLimit: 2000,
    popular: true,
  },
  {
    name: "Enterprise",
    type: "ENTERPRISE" as const,
    price: 299,
    billingCycle: "monthly" as const,
    features: [
      "Unlimited leads",
      "Custom reporting",
      "24/7 dedicated support",
      "Unlimited team members",
      "Custom integrations",
      "Advanced security",
      "On-premise deployment",
    ],
    usageLimit: -1,
    popular: false,
  },
];

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = React.useState<BillingInfo | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [upgrading, setUpgrading] = React.useState<string | null>(null);

  const fetchBillingInfo = React.useCallback(async () => {
    try {
      setLoading(true);
      // Simulated billing data - replace with actual API call
      const mockBillingInfo: BillingInfo = {
        currentPlan: {
          name: "Basic",
          type: "BASIC",
          price: 29,
          billingCycle: "monthly",
          features: [
            "Up to 500 leads per month",
            "Advanced reporting",
            "Priority email support",
            "10 team members",
            "Export to PDF/Excel",
          ],
          usageLimit: 500,
          currentUsage: 247,
        },
        paymentMethod: {
          type: "CARD",
          last4: "4242",
          brand: "Visa",
          expiryMonth: 12,
          expiryYear: 2025,
        },
        billingHistory: [
          {
            id: "inv_001",
            date: "2024-01-15",
            amount: 29.0,
            status: "PAID",
            description: "Basic Plan - January 2024",
            invoiceUrl: "#",
          },
          {
            id: "inv_002",
            date: "2023-12-15",
            amount: 29.0,
            status: "PAID",
            description: "Basic Plan - December 2023",
            invoiceUrl: "#",
          },
          {
            id: "inv_003",
            date: "2023-11-15",
            amount: 29.0,
            status: "PAID",
            description: "Basic Plan - November 2023",
            invoiceUrl: "#",
          },
          {
            id: "inv_004",
            date: "2023-10-15",
            amount: 0.0,
            status: "PAID",
            description: "Free Plan - October 2023",
          },
        ],
        nextBilling: {
          date: "2024-02-15",
          amount: 29.0,
        },
      };

      setBillingInfo(mockBillingInfo);
    } catch (error) {
      console.error("Failed to fetch billing info:", error);
      toast.error("Failed to load billing information");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePlanUpgrade = async (planType: string) => {
    try {
      setUpgrading(planType);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Successfully upgraded to ${planType} plan!`);
      // Refresh billing info
      void fetchBillingInfo();
    } catch (error) {
      console.error("Failed to upgrade plan:", error);
      toast.error("Failed to upgrade plan. Please try again.");
    } finally {
      setUpgrading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <IconCheck className="h-4 w-4 text-green-600" />;
      case "PENDING":
        return <IconClock className="h-4 w-4 text-yellow-600" />;
      case "FAILED":
        return <IconX className="h-4 w-4 text-red-600" />;
      case "REFUNDED":
        return <IconAlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "FAILED":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "REFUNDED":
        return (
          <Badge className="bg-orange-100 text-orange-800">Refunded</Badge>
        );
      default:
        return (
          <Badge className="border border-gray-300 text-gray-600">
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  React.useEffect(() => {
    void fetchBillingInfo();
  }, [fetchBillingInfo]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground animate-pulse">
            Loading billing information...
          </div>
        </div>
      </div>
    );
  }

  if (!billingInfo) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-destructive">
            Failed to load billing information
          </div>
          <Button onClick={fetchBillingInfo} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Billing & Subscription
        </h2>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and billing history.
        </p>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCrown className="h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your active subscription and usage details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {billingInfo.currentPlan.name}
                </h3>
                <p className="text-muted-foreground">
                  ${billingInfo.currentPlan.price}/
                  {billingInfo.currentPlan.billingCycle}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Lead Usage</span>
                <span className="font-medium">
                  {billingInfo.currentPlan.currentUsage} /{" "}
                  {billingInfo.currentPlan.usageLimit === -1
                    ? "Unlimited"
                    : billingInfo.currentPlan.usageLimit}
                </span>
              </div>
              {billingInfo.currentPlan.usageLimit !== -1 && (
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${getUsagePercentage(
                        billingInfo.currentPlan.currentUsage,
                        billingInfo.currentPlan.usageLimit,
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Plan Features:</h4>
              <ul className="space-y-1">
                {billingInfo.currentPlan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <IconCheck className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Payment method and next billing cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {billingInfo.paymentMethod.type ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <IconCreditCard className="text-muted-foreground h-8 w-8" />
                  <div>
                    <p className="font-medium">
                      {billingInfo.paymentMethod.brand} ••••{" "}
                      {billingInfo.paymentMethod.last4}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Expires {billingInfo.paymentMethod.expiryMonth}/
                      {billingInfo.paymentMethod.expiryYear}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update Payment Method
                </Button>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground mb-3">
                  No payment method on file
                </p>
                <Button>Add Payment Method</Button>
              </div>
            )}

            {billingInfo.nextBilling && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Next Billing</h4>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <IconCalendar className="h-4 w-4" />
                    <span>
                      {formatDate(billingInfo.nextBilling.date)} - $
                      {billingInfo.nextBilling.amount}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5" />
            Available Plans
          </CardTitle>
          <CardDescription>
            Choose a plan that fits your business needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => {
              const isCurrent = plan.type === billingInfo.currentPlan.type;
              const canUpgrade =
                plans.findIndex(
                  (p) => p.type === billingInfo.currentPlan.type,
                ) < plans.findIndex((p) => p.type === plan.type);

              return (
                <div
                  key={plan.type}
                  className={`relative rounded-lg border p-4 ${
                    plan.popular ? "border-blue-500 shadow-md" : "border-border"
                  } ${isCurrent ? "bg-blue-50" : ""}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 transform bg-blue-600">
                      Most Popular
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge className="absolute -top-2 right-2 bg-green-600">
                      Current
                    </Badge>
                  )}

                  <div className="text-center">
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.billingCycle}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <IconCheck className="h-4 w-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    {isCurrent ? (
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : canUpgrade ? (
                      <Button
                        onClick={() => handlePlanUpgrade(plan.type)}
                        disabled={upgrading !== null}
                        className="w-full"
                      >
                        {upgrading === plan.type ? "Upgrading..." : "Upgrade"}
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="w-full">
                        Downgrade
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconReceipt className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingInfo.billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {formatDate(invoice.date)}
                  </TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      {getStatusBadge(invoice.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {invoice.invoiceUrl && (
                        <Button size="sm" variant="outline">
                          <IconDownload className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <IconExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

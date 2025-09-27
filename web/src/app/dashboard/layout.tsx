"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  IconBell,
  IconBellRinging,
  IconUser,
  IconAlertTriangle,
  IconInfoCircle,
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Notification = {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  // Sample notifications - in a real app, these would come from an API
  React.useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "Lead Converted",
        message:
          "John Doe's Home Loan application has been successfully converted!",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        read: false,
        actionUrl: "/dashboard/leads/my-leads",
      },
      {
        id: "2",
        type: "warning",
        title: "High Priority Lead",
        message:
          "New lead with priority score 95 requires immediate attention.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionUrl: "/dashboard/leads/all-leads",
      },
      {
        id: "3",
        type: "info",
        title: "Weekly Report Ready",
        message:
          "Your weekly performance report is now available for download.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        actionUrl: "/dashboard/reports",
      },
      {
        id: "4",
        type: "error",
        title: "Credit Score Verification Failed",
        message:
          "Unable to verify credit score for lead ID: ABC123. Please check manually.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        actionUrl: "/dashboard/leads/my-leads",
      },
      {
        id: "5",
        type: "info",
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight from 11 PM to 1 AM.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
      },
    ];
    setNotifications(sampleNotifications);
  }, []);

  // Expect paths like /dashboard, /dashboard/leads, /dashboard/leads/my-leads
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = parts.map((part, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const label = part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label };
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <IconCheck className="h-4 w-4 text-green-500" />;
      case "warning":
        return <IconAlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <IconX className="h-4 w-4 text-red-500" />;
      case "info":
        return <IconInfoCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <IconBell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center justify-between gap-2 px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {crumbs.map((c, idx) => (
                    <React.Fragment key={c.href}>
                      <BreadcrumbItem
                        className={idx < 2 ? "hidden md:block" : undefined}
                      >
                        {idx < crumbs.length - 1 ? (
                          <BreadcrumbLink asChild>
                            <Link href={c.href}>{c.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{c.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {idx < crumbs.length - 1 && (
                        <BreadcrumbSeparator
                          className={idx < 1 ? "hidden md:block" : undefined}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    {unreadCount > 0 ? (
                      <IconBellRinging className="h-4 w-4" />
                    ) : (
                      <IconBell className="h-4 w-4" />
                    )}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[600px] sm:max-w-[500px]">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle>Notifications</DialogTitle>
                        <DialogDescription>
                          {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                            : "All caught up! No new notifications"}
                        </DialogDescription>
                      </div>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </DialogHeader>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-muted-foreground py-8 text-center">
                        <IconBell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`rounded-lg border p-3 transition-colors ${
                              notification.read
                                ? "bg-muted/30 border-muted"
                                : "bg-background border-border shadow-sm"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4
                                      className={`text-sm font-medium ${
                                        notification.read
                                          ? "text-muted-foreground"
                                          : "text-foreground"
                                      }`}
                                    >
                                      {notification.title}
                                    </h4>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                      {notification.message}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                      <IconClock className="text-muted-foreground h-3 w-3" />
                                      <span className="text-muted-foreground text-xs">
                                        {formatTimeAgo(notification.timestamp)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          markAsRead(notification.id)
                                        }
                                        className="h-6 w-6 p-0"
                                      >
                                        <IconCheck className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeNotification(notification.id)
                                      }
                                      className="text-muted-foreground hover:text-destructive h-6 w-6 p-0"
                                    >
                                      <IconX className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                {notification.actionUrl && (
                                  <div className="mt-2">
                                    <Link href={notification.actionUrl}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                      >
                                        View Details
                                      </Button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <DialogFooter className="flex-col gap-2 sm:flex-row">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full sm:w-auto"
                      >
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <ModeToggle align={"end"} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  IconUsers,
  IconRefresh,
  IconTrendingUp,
  IconClock,
  IconTarget,
} from "@tabler/icons-react";
import { toast } from "sonner";

type User = {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
};

type Lead = {
  _id: string;
  customerName: string;
  productType: string;
  status: "New" | "In Progress" | "Converted" | "Dropped";
  priorityScore: number;
  assignedTo?: User | null;
  lastUpdated?: string;
};

type UserDistribution = {
  user: User;
  totalLeads: number;
  newLeads: number;
  inProgressLeads: number;
  convertedLeads: number;
  droppedLeads: number;
  conversionRate: number;
};

export default function LeadDistributionPage() {
  const [distributions, setDistributions] = React.useState<UserDistribution[]>(
    [],
  );
  const [loading, setLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

  const fetchCurrentUser = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const userData = (await response.json()) as { user: User };
      return userData.user;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return null;
    }
  }, [API_BASE]);

  const fetchUsers = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = (await response.json()) as { users: User[] };
      return data.users ?? [];
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  }, [API_BASE]);

  const fetchAllLeads = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const response = await fetch(`${API_BASE}/leads/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch leads");

      const data = (await response.json()) as { leads: Lead[] };
      return data.leads ?? [];
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      return [];
    }
  }, [API_BASE]);

  const loadDistribution = React.useCallback(async () => {
    try {
      setLoading(true);

      const [user, users, leads] = await Promise.all([
        fetchCurrentUser(),
        fetchUsers(),
        fetchAllLeads(),
      ]);

      if (!user) {
        toast.error("Unable to fetch current user");
        return;
      }

      setCurrentUser(user);

      // Filter users based on current user's role
      const isSuperAdmin = user.roles.includes("SUPERADMIN");
      const isAdmin = user.roles.includes("ADMIN");

      let filteredUsers: User[] = [];

      if (isSuperAdmin) {
        // Super Admin can see Managers and Admins
        filteredUsers = users.filter(
          (u) => u.roles.includes("MANAGER") || u.roles.includes("ADMIN"),
        );
      } else if (isAdmin) {
        // Admin can see Managers only
        filteredUsers = users.filter((u) => u.roles.includes("MANAGER"));
      }

      // Calculate distribution for each filtered user
      const userDistributions: UserDistribution[] = filteredUsers.map(
        (user) => {
          const userLeads = leads.filter(
            (lead) => lead.assignedTo?._id === user._id,
          );

          const totalLeads = userLeads.length;
          const newLeads = userLeads.filter((l) => l.status === "New").length;
          const inProgressLeads = userLeads.filter(
            (l) => l.status === "In Progress",
          ).length;
          const convertedLeads = userLeads.filter(
            (l) => l.status === "Converted",
          ).length;
          const droppedLeads = userLeads.filter(
            (l) => l.status === "Dropped",
          ).length;

          const conversionRate =
            totalLeads > 0
              ? Math.round((convertedLeads / totalLeads) * 100)
              : 0;

          return {
            user,
            totalLeads,
            newLeads,
            inProgressLeads,
            convertedLeads,
            droppedLeads,
            conversionRate,
          };
        },
      );

      // Sort by total leads descending
      userDistributions.sort((a, b) => b.totalLeads - a.totalLeads);

      setDistributions(userDistributions);
      toast.success(
        `Loaded distribution for ${userDistributions.length} users`,
      );
    } catch (error) {
      console.error("Failed to load distribution:", error);
      toast.error("Failed to load lead distribution");
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser, fetchUsers, fetchAllLeads]);

  React.useEffect(() => {
    void loadDistribution();
  }, [loadDistribution]);

  const totalStats = React.useMemo(() => {
    const totals = distributions.reduce(
      (acc, dist) => ({
        totalLeads: acc.totalLeads + dist.totalLeads,
        newLeads: acc.newLeads + dist.newLeads,
        inProgressLeads: acc.inProgressLeads + dist.inProgressLeads,
        convertedLeads: acc.convertedLeads + dist.convertedLeads,
        droppedLeads: acc.droppedLeads + dist.droppedLeads,
      }),
      {
        totalLeads: 0,
        newLeads: 0,
        inProgressLeads: 0,
        convertedLeads: 0,
        droppedLeads: 0,
      },
    );

    const avgConversionRate =
      distributions.length > 0
        ? Math.round(
            distributions.reduce((acc, dist) => acc + dist.conversionRate, 0) /
              distributions.length,
          )
        : 0;

    return { ...totals, avgConversionRate };
  }, [distributions]);

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes("SUPERADMIN")) return "Super Admin";
    if (roles.includes("ADMIN")) return "Admin";
    if (roles.includes("MANAGER")) return "Manager";
    return "User";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Lead Distribution
          </h2>
          <p className="text-muted-foreground">
            Monitor lead assignments and performance across your team.
          </p>
        </div>
        <Button
          onClick={() => void loadDistribution()}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <IconRefresh className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUsers className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{distributions.length}</div>
            <p className="text-muted-foreground text-xs">
              {currentUser?.roles.includes("SUPERADMIN")
                ? "Admins & Managers"
                : "Managers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <IconTarget className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalLeads}</div>
            <p className="text-muted-foreground text-xs">
              Distributed across team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <IconClock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.inProgressLeads}
            </div>
            <p className="text-muted-foreground text-xs">
              Active leads being worked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Conversion
            </CardTitle>
            <IconTrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.avgConversionRate}%
            </div>
            <p className="text-muted-foreground text-xs">Team average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Lead Distribution</CardTitle>
          <CardDescription>
            Lead assignments and performance metrics for your team members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Total Leads</TableHead>
                <TableHead className="text-center">New</TableHead>
                <TableHead className="text-center">In Progress</TableHead>
                <TableHead className="text-center">Converted</TableHead>
                <TableHead className="text-center">Dropped</TableHead>
                <TableHead className="text-center">Conversion Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : distributions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-muted-foreground text-center"
                  >
                    No team members found.
                  </TableCell>
                </TableRow>
              ) : (
                distributions.map((dist) => (
                  <TableRow key={dist.user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{dist.user.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {dist.user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {getRoleDisplayName(dist.user.roles)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {dist.totalLeads}
                    </TableCell>
                    <TableCell className="text-center">
                      {dist.newLeads}
                    </TableCell>
                    <TableCell className="text-center">
                      {dist.inProgressLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-green-600">
                      {dist.convertedLeads}
                    </TableCell>
                    <TableCell className="text-center text-red-600">
                      {dist.droppedLeads}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="bg-muted h-2 w-12 rounded">
                          <div
                            className="bg-primary h-2 rounded"
                            style={{
                              width: `${Math.min(dist.conversionRate, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm">{dist.conversionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          dist.user.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {dist.user.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

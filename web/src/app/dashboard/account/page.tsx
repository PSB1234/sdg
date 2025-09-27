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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconShield,
  IconEdit,
  IconCamera,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

type User = {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  phone?: string;
  address?: string;
  department?: string;
  profilePicture?: string;
};

export default function AccountPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    department: "",
  });

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

  const fetchUserProfile = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = (await response.json()) as { user: User };
      setUser(data.user);
      setFormData({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone ?? "",
        address: data.user.address ?? "",
        department: data.user.department ?? "",
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load profile information");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = (await response.json()) as { user: User };
      setUser(data.user);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        address: user.address ?? "",
        department: user.department ?? "",
      });
    }
    setEditing(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getRoleDisplayName = (roles: string[]) => {
    if (roles.includes("SUPERADMIN")) return "Super Administrator";
    if (roles.includes("ADMIN")) return "Administrator";
    if (roles.includes("MANAGER")) return "Manager";
    return "User";
  };

  const getRoleBadgeColor = (roles: string[]) => {
    if (roles.includes("SUPERADMIN")) return "bg-red-100 text-red-800";
    if (roles.includes("ADMIN")) return "bg-purple-100 text-purple-800";
    if (roles.includes("MANAGER")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  React.useEffect(() => {
    void fetchUserProfile();
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground animate-pulse">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-destructive">
            Failed to load profile information
          </div>
          <Button onClick={fetchUserProfile} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your personal information and account preferences.
          </p>
        </div>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2"
          >
            <IconEdit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="mx-auto h-24 w-24">
                <AvatarImage
                  src={user.profilePicture ?? "/avatars/default.jpg"}
                  alt={user.name}
                />
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute right-0 bottom-0 h-8 w-8 rounded-full p-0"
                disabled={!editing}
              >
                <IconCamera className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="mt-4">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getRoleBadgeColor(user.roles)}`}
              >
                <IconShield className="mr-1 h-4 w-4" />
                {getRoleDisplayName(user.roles)}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
                />
                <span className="text-muted-foreground">
                  {user.isActive ? "Active Account" : "Inactive Account"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <IconUser className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!editing}
                  className={!editing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <IconMail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!editing}
                  className={!editing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <IconPhone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!editing}
                  className={!editing ? "bg-muted" : ""}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <IconShield className="h-4 w-4" />
                  Department
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  disabled={!editing}
                  className={!editing ? "bg-muted" : ""}
                  placeholder="Enter department"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!editing}
                className={!editing ? "bg-muted" : ""}
                placeholder="Enter complete address"
              />
            </div>

            {editing && (
              <div className="flex gap-3 border-t pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <IconCheck className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <IconX className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Security settings and account information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>User ID</Label>
              <div className="flex items-center gap-2">
                <code className="bg-muted rounded px-2 py-1 text-sm">
                  {user._id}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(user._id);
                    toast.success("User ID copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  value="••••••••"
                  disabled
                  className="bg-muted"
                />
                <Button size="sm" variant="outline">
                  Change
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { Separator } from "@/components/ui/separator";
import {
  IconBell,
  IconShield,
  IconPalette,
  IconDatabase,
  IconKey,
  IconTrash,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { toast } from "sonner";

// Simple toggle component
const Toggle = ({
  checked,
  onCheckedChange,
  disabled = false,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={`Toggle ${checked ? "off" : "on"}`}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={`focus-visible:ring-ring relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-primary" : "bg-input"} `}
  >
    <span
      className={`bg-background inline-block h-4 w-4 transform rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-1"} `}
    />
  </button>
);

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

type SettingsData = {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    leadUpdates: boolean;
    systemAlerts: boolean;
    weeklyReports: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  system: {
    autoBackup: boolean;
    dataRetention: number;
    exportFormat: "csv" | "xlsx" | "pdf";
    apiAccess: boolean;
  };
};

const defaultSettings: SettingsData = {
  notifications: {
    email: true,
    push: true,
    marketing: false,
    leadUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
  },
  preferences: {
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/dd/yyyy",
    currency: "USD",
  },
  privacy: {
    dataSharing: false,
    analytics: true,
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
  },
  system: {
    autoBackup: true,
    dataRetention: 365,
    exportFormat: "xlsx",
    apiAccess: false,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<SettingsData>(defaultSettings);
  const [saving, setSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  const updateSetting = <
    T extends keyof SettingsData,
    K extends keyof SettingsData[T],
  >(
    section: T,
    key: K,
    value: SettingsData[T][K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Settings saved successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info("Settings reset to defaults");
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `settings-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Settings exported successfully!");
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(
          e.target?.result as string,
        ) as SettingsData;
        setSettings(importedSettings);
        setHasChanges(true);
        toast.success("Settings imported successfully!");
      } catch {
        toast.error("Invalid settings file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your application preferences and account settings.
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
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
          )}
          <Button variant="outline" onClick={handleReset}>
            <IconRefresh className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <IconAlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              You have unsaved changes
            </span>
          </div>
        </div>
      )}

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Email Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications via email
                </p>
              </div>
              <Toggle
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "email", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Push Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Browser push notifications
                </p>
              </div>
              <Toggle
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "push", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Marketing Emails</Label>
                <p className="text-muted-foreground text-sm">
                  Product updates and offers
                </p>
              </div>
              <Toggle
                checked={settings.notifications.marketing}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "marketing", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Lead Updates</Label>
                <p className="text-muted-foreground text-sm">
                  Notifications for lead changes
                </p>
              </div>
              <Toggle
                checked={settings.notifications.leadUpdates}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "leadUpdates", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">System Alerts</Label>
                <p className="text-muted-foreground text-sm">
                  Important system notifications
                </p>
              </div>
              <Toggle
                checked={settings.notifications.systemAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "systemAlerts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Weekly Reports</Label>
                <p className="text-muted-foreground text-sm">
                  Weekly activity summary
                </p>
              </div>
              <Toggle
                checked={settings.notifications.weeklyReports}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "weeklyReports", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPalette className="h-5 w-5" />
            Display & Language
          </CardTitle>
          <CardDescription>
            Customize your display preferences and language settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Theme</Label>
              <select
                value={settings.preferences.theme}
                onChange={(e) =>
                  updateSetting(
                    "preferences",
                    "theme",
                    e.target.value as "light" | "dark" | "system",
                  )
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <select
                value={settings.preferences.language}
                onChange={(e) =>
                  updateSetting("preferences", "language", e.target.value)
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) =>
                  updateSetting("preferences", "timezone", e.target.value)
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <select
                value={settings.preferences.dateFormat}
                onChange={(e) =>
                  updateSetting("preferences", "dateFormat", e.target.value)
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                <option value="dd MMM yyyy">dd MMM yyyy</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <select
                value={settings.preferences.currency}
                onChange={(e) =>
                  updateSetting("preferences", "currency", e.target.value)
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
          <CardDescription>
            Manage security settings and privacy preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Two-Factor Authentication</Label>
                <p className="text-muted-foreground text-sm">
                  Add extra security to your account
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    updateSetting("security", "twoFactorAuth", checked)
                  }
                />
                {settings.security.twoFactorAuth && (
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Login Alerts</Label>
                <p className="text-muted-foreground text-sm">
                  Notify me of new logins
                </p>
              </div>
              <Toggle
                checked={settings.security.loginAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("security", "loginAlerts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Data Sharing</Label>
                <p className="text-muted-foreground text-sm">
                  Share anonymous usage data
                </p>
              </div>
              <Toggle
                checked={settings.privacy.dataSharing}
                onCheckedChange={(checked) =>
                  updateSetting("privacy", "dataSharing", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Analytics</Label>
                <p className="text-muted-foreground text-sm">
                  Help improve our service
                </p>
              </div>
              <Toggle
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) =>
                  updateSetting("privacy", "analytics", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  updateSetting(
                    "security",
                    "sessionTimeout",
                    Number(e.target.value),
                  )
                }
                min="5"
                max="240"
              />
            </div>

            <div className="space-y-2">
              <Label>Password Expiry (days)</Label>
              <Input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) =>
                  updateSetting(
                    "security",
                    "passwordExpiry",
                    Number(e.target.value),
                  )
                }
                min="30"
                max="365"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconDatabase className="h-5 w-5" />
            System & Data
          </CardTitle>
          <CardDescription>
            Configure system behavior and data management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Auto Backup</Label>
                <p className="text-muted-foreground text-sm">
                  Automatic daily backups
                </p>
              </div>
              <Toggle
                checked={settings.system.autoBackup}
                onCheckedChange={(checked) =>
                  updateSetting("system", "autoBackup", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">API Access</Label>
                <p className="text-muted-foreground text-sm">
                  Enable API for integrations
                </p>
              </div>
              <Toggle
                checked={settings.system.apiAccess}
                onCheckedChange={(checked) =>
                  updateSetting("system", "apiAccess", checked)
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Data Retention (days)</Label>
              <Input
                type="number"
                value={settings.system.dataRetention}
                onChange={(e) =>
                  updateSetting(
                    "system",
                    "dataRetention",
                    Number(e.target.value),
                  )
                }
                min="30"
                max="3650"
              />
            </div>

            <div className="space-y-2">
              <Label>Default Export Format</Label>
              <select
                value={settings.system.exportFormat}
                onChange={(e) =>
                  updateSetting(
                    "system",
                    "exportFormat",
                    e.target.value as "csv" | "xlsx" | "pdf",
                  )
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconKey className="h-5 w-5" />
            Backup & Restore
          </CardTitle>
          <CardDescription>
            Export your settings or import from a backup file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleExportSettings}
              className="flex items-center gap-2"
            >
              <IconDownload className="h-4 w-4" />
              Export Settings
            </Button>

            <div className="relative">
              <Button variant="outline" className="flex items-center gap-2">
                <IconUpload className="h-4 w-4" />
                Import Settings
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>

            <Button
              variant="destructive"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to delete all data? This action cannot be undone.",
                  )
                ) {
                  toast.success(
                    "Account deletion initiated. You will receive an email confirmation.",
                  );
                }
              }}
              className="ml-auto flex items-center gap-2"
            >
              <IconTrash className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

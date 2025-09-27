"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type LeadItem = {
  _id: string;
  customerName: string;
  productType: string;
  status: "New" | "In Progress" | "Converted" | "Dropped";
  priorityScore: number;
  assignedTo?: { name?: string } | null;
  lastUpdated?: string;
  creditScore?: number;
  customerDetails?: {
    creditScore?: number;
    source?: "campaign" | "branch" | "online";
  };
  zone?: string;
};

function StatusPill({ status }: { status: LeadItem["status"] }) {
  const styles =
    status === "Converted"
      ? "bg-emerald-500/15 text-emerald-500"
      : status === "In Progress"
        ? "bg-blue-500/15 text-blue-500"
        : status === "Dropped"
          ? "bg-red-500/15 text-red-500"
          : "bg-zinc-500/15 text-zinc-400";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

export default function AllLeadsPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

  const [data, setData] = React.useState<LeadItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedLead, setSelectedLead] = React.useState<LeadItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token =
        typeof window !== "undefined"
          ? (localStorage.getItem("token") ?? localStorage.getItem("authToken"))
          : null;
      const res = await fetch(`${API_BASE}/leads/all`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed with ${res.status}`);
      }
      const json = (await res.json()) as { leads: LeadItem[] };
      setData(json.leads || []);
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e && "message" in e
          ? String((e as { message?: string }).message)
          : "Failed to load leads";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleUpdateLead = async (
    leadId: string,
    updates: Partial<LeadItem>,
  ) => {
    try {
      setUpdating(true);
      const token =
        typeof window !== "undefined"
          ? (localStorage.getItem("token") ?? localStorage.getItem("authToken"))
          : null;

      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(`Failed to update lead: ${res.statusText}`);
      }

      toast.success("Lead updated successfully!");
      setDialogOpen(false);
      void load(); // Refresh the data
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update lead");
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateDialog = (lead: LeadItem) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  return (
    <div className="rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Leads</h2>
        <Button size="sm" variant="outline" onClick={() => load()}>
          Refresh
        </Button>
      </div>
      {error ? (
        <div className="text-destructive mb-4 text-sm">{error}</div>
      ) : null}

      {/* Update Lead Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Lead</DialogTitle>
            <DialogDescription>
              Make changes to the lead details. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <select
                  id="status"
                  className="border-input bg-background focus:ring-ring col-span-3 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  defaultValue={selectedLead.status}
                  onChange={(e) => {
                    if (selectedLead) {
                      setSelectedLead({
                        ...selectedLead,
                        status: e.target.value as LeadItem["status"],
                      });
                    }
                  }}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Converted">Converted</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  max="100"
                  className="col-span-3"
                  defaultValue={selectedLead.priorityScore}
                  onChange={(e) => {
                    if (selectedLead) {
                      setSelectedLead({
                        ...selectedLead,
                        priorityScore: Number(e.target.value) || 0,
                      });
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zone" className="text-right">
                  Zone
                </Label>
                <Input
                  id="zone"
                  className="col-span-3"
                  defaultValue={selectedLead.zone ?? ""}
                  onChange={(e) => {
                    if (selectedLead) {
                      setSelectedLead({
                        ...selectedLead,
                        zone: e.target.value,
                      });
                    }
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateLead(selectedLead._id, {
                      status: selectedLead.status,
                      priorityScore: selectedLead.priorityScore,
                      zone: selectedLead.zone,
                    })
                  }
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Lead ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Credit Score</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10}>Loading…</TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-muted-foreground">
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">
                  {lead._id.slice(0, 8)}
                </TableCell>
                <TableCell>{lead.customerName}</TableCell>
                <TableCell>{lead.productType}</TableCell>
                <TableCell>
                  <StatusPill status={lead.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 w-24 rounded">
                      <div
                        className="bg-primary h-2 rounded"
                        style={{ width: `${lead.priorityScore}%` }}
                      />
                    </div>
                    <span className="tabular-nums">{lead.priorityScore}</span>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">
                  {lead.creditScore ?? "—"}
                </TableCell>
                <TableCell className="capitalize">
                  {lead.customerDetails?.source ?? "—"}
                </TableCell>
                <TableCell>{lead.zone ?? "—"}</TableCell>
                <TableCell>
                  {lead.lastUpdated
                    ? new Date(lead.lastUpdated).toLocaleString()
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => openUpdateDialog(lead)}>
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

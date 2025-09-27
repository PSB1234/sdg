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

export default function MyLeadsPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

  const [data, setData] = React.useState<LeadItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token =
        typeof window !== "undefined"
          ? (localStorage.getItem("token") ?? localStorage.getItem("authToken"))
          : null;
      const res = await fetch(`${API_BASE}/leads/my`, {
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

  return (
    <div className="rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">My Leads</h2>
        <Button size="sm" variant="outline" onClick={() => load()}>
          Refresh
        </Button>
      </div>
      {error ? (
        <div className="text-destructive mb-4 text-sm">{error}</div>
      ) : null}
      <Table>
        <TableCaption>Leads currently assigned to you.</TableCaption>
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
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">Update</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

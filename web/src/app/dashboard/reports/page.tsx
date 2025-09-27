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
import {
  IconFileTypePdf,
  IconDownload,
  IconEye,
  IconRefresh,
} from "@tabler/icons-react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";

type LeadItem = {
  _id: string;
  customerName: string;
  productType: string;
  status: "New" | "In Progress" | "Converted" | "Dropped";
  priorityScore: number;
  assignedTo?: { name?: string } | null;
  lastUpdated?: string;
  creditScore?: number;
  email?: string;
  phoneNumber?: string;
  loanAmount?: number;
  annualIncome?: number;
};

export default function ReportsPage() {
  const [leads, setLeads] = React.useState<LeadItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = React.useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

  const fetchMyLeads = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/leads/my`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = (await response.json()) as { leads: LeadItem[] };
      setLeads(data.leads ?? []);
      toast.success(`Loaded ${data.leads?.length ?? 0} leads`);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to fetch leads data");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const generatePDF = React.useCallback(async () => {
    try {
      setGeneratingPdf(true);

      // Create a temporary div to hold the content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">My Leads Report</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Summary</h3>
            <p><strong>Total Leads:</strong> ${leads.length}</p>
            <p><strong>New:</strong> ${leads.filter((l) => l.status === "New").length}</p>
            <p><strong>In Progress:</strong> ${leads.filter((l) => l.status === "In Progress").length}</p>
            <p><strong>Converted:</strong> ${leads.filter((l) => l.status === "Converted").length}</p>
            <p><strong>Dropped:</strong> ${leads.filter((l) => l.status === "Dropped").length}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Lead ID</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Customer Name</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Product Type</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Status</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Priority</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Credit Score</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Loan Amount</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${leads
                .map((lead) => {
                  const statusColors: Record<string, string> = {
                    New: "#fef3c7",
                    "In Progress": "#dbeafe",
                    Converted: "#d1fae5",
                    Dropped: "#fecaca",
                  };
                  return `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead._id.slice(0, 8)}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.customerName}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.productType}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px; background: ${statusColors[lead.status] ?? "#fff"};">${lead.status}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.priorityScore}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.creditScore ?? "—"}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.loanAmount ? "₹" + lead.loanAmount.toLocaleString() : "—"}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.lastUpdated ? new Date(lead.lastUpdated).toLocaleDateString() : "—"}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      // Generate PDF and create blob URL for preview
      const opt = {
        margin: 10,
        filename: `my-leads-report-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" as const },
      };

      // Generate PDF blob
      const pdfBlob = (await html2pdf()
        .set(opt)
        .from(tempDiv)
        .outputPdf("blob")) as Blob;
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setGeneratingPdf(false);
    }
  }, [leads]);

  const downloadPDF = React.useCallback(async () => {
    if (!pdfUrl) {
      toast.error("Please generate a report first");
      return;
    }

    try {
      // Create a temporary div to hold the content for PDF generation
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">My Leads Report</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Summary</h3>
            <p><strong>Total Leads:</strong> ${leads.length}</p>
            <p><strong>New:</strong> ${leads.filter((l) => l.status === "New").length}</p>
            <p><strong>In Progress:</strong> ${leads.filter((l) => l.status === "In Progress").length}</p>
            <p><strong>Converted:</strong> ${leads.filter((l) => l.status === "Converted").length}</p>
            <p><strong>Dropped:</strong> ${leads.filter((l) => l.status === "Dropped").length}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Lead ID</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Customer Name</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Product Type</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Status</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Priority</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Credit Score</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Loan Amount</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; font-weight: bold; font-size: 12px;">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${leads
                .map((lead) => {
                  const statusColors: Record<string, string> = {
                    New: "#fef3c7",
                    "In Progress": "#dbeafe",
                    Converted: "#d1fae5",
                    Dropped: "#fecaca",
                  };
                  return `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead._id.slice(0, 8)}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.customerName}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.productType}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px; background: ${statusColors[lead.status] ?? "#fff"};">${lead.status}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.priorityScore}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.creditScore ?? "—"}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.loanAmount ? "₹" + lead.loanAmount.toLocaleString() : "—"}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">${lead.lastUpdated ? new Date(lead.lastUpdated).toLocaleDateString() : "—"}</td>
                    </tr>
                    `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      // Generate and download PDF
      const opt = {
        margin: 10,
        filename: `my-leads-report-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" as const },
      };

      await html2pdf().set(opt).from(tempDiv).save();
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF report");
    }
  }, [pdfUrl, leads]);

  React.useEffect(() => {
    void fetchMyLeads();
  }, [fetchMyLeads]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate and export insights from your leads data.
          </p>
        </div>
        <Button
          onClick={fetchMyLeads}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <IconRefresh className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Report Generation Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFileTypePdf className="h-5 w-5 text-red-500" />
            My Leads Report
          </CardTitle>
          <CardDescription>
            Generate a comprehensive PDF report of all your assigned leads with
            detailed statistics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-2xl font-bold">{leads.length}</div>
              <div className="text-muted-foreground text-sm">Total Leads</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {leads.filter((l) => l.status === "In Progress").length}
              </div>
              <div className="text-muted-foreground text-sm">In Progress</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {leads.filter((l) => l.status === "Converted").length}
              </div>
              <div className="text-muted-foreground text-sm">Converted</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={generatePDF}
              disabled={generatingPdf || leads.length === 0}
              className="flex items-center gap-2"
            >
              <IconFileTypePdf className="h-4 w-4" />
              {generatingPdf ? "Generating..." : "Generate PDF Report"}
            </Button>

            {pdfUrl && (
              <>
                <Button
                  onClick={downloadPDF}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <IconDownload className="h-4 w-4" />
                  Download Report
                </Button>
                <Button
                  onClick={() => window.open(pdfUrl, "_blank")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <IconEye className="h-4 w-4" />
                  Preview Report
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PDF Preview */}
      {pdfUrl && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              Preview of your generated leads report. Click &ldquo;Preview
              Report&rdquo; to open in full screen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <iframe
                src={pdfUrl}
                width="100%"
                height="600px"
                className="border-0"
                title="PDF Report Preview"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Report Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              • <strong>Comprehensive Data:</strong> Includes all lead details,
              status, and priorities
            </li>
            <li>
              • <strong>Summary Statistics:</strong> Overview of lead
              distribution by status
            </li>
            <li>
              • <strong>Professional Format:</strong> Clean, printable layout
              with proper styling
            </li>
            <li>
              • <strong>Real-time Data:</strong> Always uses the latest
              information from your assigned leads
            </li>
            <li>
              • <strong>Export Options:</strong> Download as HTML file or print
              directly from browser
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

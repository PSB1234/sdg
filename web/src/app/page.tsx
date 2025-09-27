import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1, H2, H3, P, Lead, H4 } from "@/components/typography";
import { ModeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <nav className="container mx-auto flex max-w-6xl items-center justify-between py-6">
        <div className="flex flex-row items-center justify-center gap-2 text-center">
          <Image
            src="/favicon.ico"
            width={30}
            height={30}
            alt="logo"
            className="rounded-sm"
          />
          <H4>SDG Finance</H4>
        </div>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Create Account</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login">Sign In</Link>
          </Button>
          <div className="flex items-center justify-center">
            <ModeToggle align="end" />
          </div>
        </div>
      </nav>{" "}
      {/* Hero */}
      <section className="container mx-auto max-w-6xl px-6 py-16">
        <Image
          src="/Telecommuting-pana.svg"
          width={500}
          height={500}
          alt="Stuck at Home - Stats and Graphs"
          className="mx-auto rounded-lg"
        />
        <div className="mx-auto max-w-3xl text-center">
          <H1 className="text-balance">SDG Finance </H1>
          <div className="text-muted-foreground mt-4">
            <Lead className="mx-auto text-balance">
              Bank-grade lead capture, assignment, and tracking with strict
              access control, complete audit trails, and role-specific
              dashboards.
            </Lead>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Open Web App</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Key Features */}
      <section
        id="features"
        className="container mx-auto max-w-6xl border-b px-6 py-14 pb-4"
      >
        <H2 className="text-balance">What you get out of the box</H2>
        <P className="text-muted-foreground">
          A centralized, lightweight system designed for Processing Centres,
          Nodal Officers, and Higher Authorities to collaborate with
          accountability and transparency.
        </P>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Role‑Based Access Control (RBAC)</CardTitle>
              <CardDescription>
                Clearly defined permissions per role with least‑privilege by
                default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                <li>Separation of duties across user types</li>
                <li>Granular create, read, update, assign rules</li>
                <li>Secure-by-default data access boundaries</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Management</CardTitle>
              <CardDescription>
                Capture, update, prioritize, assign, and monitor leads in one
                place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                <li>Central repository with lifecycle states</li>
                <li>Bulk imports with validations</li>
                <li>Ownership transfer with history</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Logging</CardTitle>
              <CardDescription>
                End‑to‑end tracking of all user actions for compliance and
                transparency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                <li>Immutable timeline of critical events</li>
                <li>Action, actor, timestamp, and before/after snapshots</li>
                <li>Searchable and exportable logs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboards</CardTitle>
              <CardDescription>
                Role‑specific views for actionable insights and tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                <li>KPI snapshots per role</li>
                <li>Work queues and SLAs</li>
                <li>Filters for status, owners, regions, and dates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                One‑click Excel/CSV export for reporting and analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                <li>Scoped exports based on role permissions</li>
                <li>Prebuilt report templates</li>
                <li>On‑demand or scheduled jobs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offline‑Ready Web App</CardTitle>
              <CardDescription>
                Seamless access on desktop and mobile with offline support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                <li>Installable PWA experience</li>
                <li>Optimistic updates and sync</li>
                <li>Secure local caching</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* AI USP */}
      <section className="container mx-auto max-w-6xl px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>
              AI‑Powered Lead Prioritization & Smart Assignment
            </CardTitle>
            <CardDescription>
              An AI engine analyzes lead attributes and assigns a &quot;Lead
              Priority Score&quot; to improve conversions and reduce drop‑offs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <H3 className="mb-2">Scoring</H3>
                <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                  <li>Customer profile and product type</li>
                  <li>Geo‑location and previous interactions</li>
                  <li>Trends like credit score signals</li>
                </ul>
              </div>
              <div>
                <H3 className="mb-2">Assignment</H3>
                <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                  <li>Auto‑prioritize high‑value leads</li>
                  <li>Intelligent routing to the best centre/officer</li>
                  <li>Load‑balancing with SLAs</li>
                </ul>
              </div>
              <div>
                <H3 className="mb-2">Prediction</H3>
                <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
                  <li>Drop‑off risk detection</li>
                  <li>Smart reminders and follow‑ups</li>
                  <li>Personalized outreach suggestions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      {/* Roles */}
      <section className="container mx-auto max-w-6xl px-6 py-12">
        <H2>Designed for every role</H2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Processing Centre Staff</CardTitle>
              <CardDescription>
                Work queues, assignments, and quick updates to keep leads
                moving.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nodal Officers</CardTitle>
              <CardDescription>
                Region‑wise visibility, approvals, and performance tracking.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Higher Authorities</CardTitle>
              <CardDescription>
                System‑wide insights, audit access, and export‑ready reports.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
      {/* CTA */}
      <section className="container mx-auto max-w-6xl px-6 pt-6 pb-20">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center md:flex-row md:text-left">
          <div>
            <H3>Ready to streamline lead operations?</H3>
            <P className="text-muted-foreground">
              Start with secure access, set roles, and bring all your leads into
              one reliable system.
            </P>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              L
            </span>
            Lumen LMS
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl space-y-6">
          <Badge variant="secondary">Phase 0 — Foundation ready</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Learn without limits.</h1>
          <p className="text-lg text-muted-foreground">
            Lumen is a global LMS marketplace where students discover courses, instructors build
            curricula, and organizations scale learning. Built on Next.js + Supabase, deployed via
            GitHub → Vercel.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Create account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>For Students</CardTitle>
              <CardDescription>Enroll, learn, earn certificates</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Progress tracking, quizzes, and verified certificates.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Instructors</CardTitle>
              <CardDescription>Create courses, grow revenue</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Curriculum builder, analytics, and payout workflows.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Operations</CardTitle>
              <CardDescription>Admin + Superadmin governance</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Moderation, permissions, audit logs, and platform health.
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Project status</CardTitle>
            <CardDescription>
              Phase 0 foundation is bootstrapped. Supabase migrations, auth, and role-aware dashboards
              are next (Phases 1–2). See ROADMAP.md for full sequencing.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
}

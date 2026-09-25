import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default async function SuperadminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Superadmin Dashboard</h1>
      <p className="text-sm text-muted-foreground">Full platform control — admin creation, permissions, audit logs, settings.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card><CardHeader><CardTitle>Admins</CardTitle><CardDescription>Create and manage admins</CardDescription></CardHeader><CardContent><EmptyState title="Admin management" description="Create, disable, assign permissions" action={<Button size="sm">Create admin</Button>} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Audit logs</CardTitle><CardDescription>Immutable platform history</CardDescription></CardHeader><CardContent><EmptyState title="No logs yet" description="Privileged actions will appear here" /></CardContent></Card>
      </div>
      <Card className="border-dashed"><CardHeader><CardTitle className="text-base">Bootstrap</CardTitle><CardDescription>Run <code>select public.bootstrap_superadmin(&apos;your@email.com&apos;);</code> once in Supabase SQL Editor</CardDescription></CardHeader></Card>
    </div>
  );
}

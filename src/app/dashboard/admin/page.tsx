import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground">Operations, moderation, and reports — permissions enforced server-side.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card><CardHeader><CardTitle>Moderation</CardTitle><CardDescription>Pending courses & reviews</CardDescription></CardHeader><CardContent><EmptyState title="No pending items" description="All caught up" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Users</CardTitle><CardDescription>Manage users & instructors</CardDescription></CardHeader><CardContent><EmptyState title="User management" description="Search and manage accounts (requires users.read)" /></CardContent></Card>
      </div>
    </div>
  );
}

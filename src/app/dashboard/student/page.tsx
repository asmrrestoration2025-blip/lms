import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Student Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        <Card><CardHeader><CardTitle>Continue learning</CardTitle><CardDescription>Pick up where you left off</CardDescription></CardHeader><CardContent><EmptyState title="No enrollments yet" description="Browse courses to start learning" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Progress</CardTitle><CardDescription>Track completion</CardDescription></CardHeader><CardContent><EmptyState title="No progress" description="Enroll in a course to see progress" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Certificates</CardTitle><CardDescription>Verified accomplishments</CardDescription></CardHeader><CardContent><EmptyState title="No certificates" description="Complete a course to earn one" /></CardContent></Card>
      </div>
    </div>
  );
}

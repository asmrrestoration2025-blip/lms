import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export default function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Instructor Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        <Card><CardHeader><CardTitle>Courses</CardTitle><CardDescription>Manage curriculum</CardDescription></CardHeader><CardContent><EmptyState title="No courses yet" description="Create your first course" action={<Button size="sm">Create course</Button>} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Revenue</CardTitle><CardDescription>Earnings overview</CardDescription></CardHeader><CardContent><EmptyState title="No earnings" description="Publish a course to start earning" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Students</CardTitle><CardDescription>Enrollment insights</CardDescription></CardHeader><CardContent><EmptyState title="No students" description="Share your course to get enrollments" /></CardContent></Card>
      </div>
    </div>
  );
}

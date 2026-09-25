import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/server/actions/auth";

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Choose a new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updatePassword} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">New password</label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>
          <Button type="submit" className="w-full">Update password</Button>
        </form>
      </CardContent>
    </Card>
  );
}

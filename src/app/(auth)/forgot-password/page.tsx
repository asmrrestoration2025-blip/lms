import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/server/actions/auth";

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>We will email you a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={requestPasswordReset} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
      </CardContent>
    </Card>
  );
}

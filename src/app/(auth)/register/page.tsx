import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/server/actions/auth";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Join Lumen — learn without limits</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signUp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
            <Input id="fullName" name="fullName" required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input id="password" name="password" type="password" required autoComplete="new-password" />
            <p className="text-xs text-muted-foreground">At least 8 characters</p>
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}

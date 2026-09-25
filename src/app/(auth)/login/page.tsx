import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/server/actions/auth";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string; reset?: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back to Lumen</CardDescription>
      </CardHeader>
      <CardContent>
        {searchParams?.error ? <p className="mb-4 text-sm text-destructive">Auth error: {searchParams.error}</p> : null}
        {searchParams?.reset === "success" ? <p className="mb-4 text-sm text-green-600">Password updated — sign in</p> : null}
        <form action={signIn} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <div className="mt-6 flex justify-between text-sm">
          <Link href="/register" className="text-primary hover:underline">Create account</Link>
          <Link href="/forgot-password" className="text-muted-foreground hover:underline">Forgot password?</Link>
        </div>
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>We sent you a verification link. Click it to activate your account, then sign in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Did not receive it? Check spam or try registering again.</p>
        <Button asChild className="w-full"><Link href="/login">Go to sign in</Link></Button>
      </CardContent>
    </Card>
  );
}

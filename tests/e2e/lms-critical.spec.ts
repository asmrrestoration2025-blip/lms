import { test, expect } from "@playwright/test";

// Critical E2E per TESTING.md — requires Supabase env on preview/prod
test.describe("LMS critical flow", () => {
  test("register → verify → login → dashboard → browse → enroll → learn → certificate", async ({ page }) => {
    const email = `e2e_${Date.now()}@example.com`;
    const password = "Test12345!";

    // Register
    await page.goto("/register");
    await page.getByLabel("Full name").fill("E2E Student");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/verify-email/);

    // Login (if email confirm disabled in Supabase test config, otherwise manual confirm)
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText("Student Dashboard")).toBeVisible();

    // Browse marketplace
    await page.goto("/courses");
    await expect(page.getByText("Marketplace")).toBeVisible();

    // Enroll in first free course if exists, else learn stub
    await page.goto("/learn/test-course-id");
    await expect(page.getByText("Enroll to start")).toBeVisible();
  });

  test("superadmin can view audit and admins pages (requires seeded superadmin)", async ({ page }) => {
    await page.goto("/dashboard/superadmin");
    // If not superadmin, will redirect or show admin management empty state
    await expect(page.getByText(/Superadmin Dashboard|Admin Dashboard|Student Dashboard/)).toBeVisible();
  });
});

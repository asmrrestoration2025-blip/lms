import { test, expect } from "@playwright/test";

test("protected /dashboard redirects to login when unauthenticated", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/login/);
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("marketplace search renders", async ({ page }) => {
  await page.goto("/courses");
  await expect(page.getByPlaceholder("Search courses")).toBeVisible();
});

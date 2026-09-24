import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Learn without limits")).toBeVisible();
  await expect(page.getByRole("link", { name: "Get started" })).toBeVisible();
});

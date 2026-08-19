import { expect, test } from "@playwright/test";

test("renders the portfolio without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sagor Hossain" })).toBeVisible();
  await expect(page.getByAltText("Sagor Hossain")).toBeVisible();
  await expect(page.getByText("Arshad Sayed")).toBeVisible();
  await expect(page.getByText("Zappilo Client · Dubai, UAE")).toBeVisible();

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens and follows the mobile navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile navigation only");
  await page.goto("/");

  await page.waitForLoadState("networkidle");
  const menuButton = page.locator(".menu-button");
  await expect(menuButton).toHaveAccessibleName("Open navigation");
  await menuButton.click();
  await expect(menuButton).toHaveAccessibleName("Close navigation");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await page.getByRole("link", { name: "Services", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Services That I Provide" })).toBeInViewport();
});

test("updates the service console from a network node", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Backend Development/ }).click();
  await expect(page.locator(".service-console").getByRole("heading", { name: "Backend Development" })).toBeVisible();
  await expect(page.locator(".service-console")).toContainText("Python");
  await expect(page.locator(".service-console")).toContainText("Django");
});

test("animates career metrics to their final values", async ({ page }) => {
  await page.goto("/");

  await page.locator(".stats-wrap").scrollIntoViewIfNeeded();
  await expect(page.getByText("1500+", { exact: true })).toBeVisible();
});

test("scrolls through all seven featured projects", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".project-track");
  await expect(track.locator(".project-card")).toHaveCount(7);
  await expect(page.getByRole("button", { name: "Scroll projects left" })).toBeDisabled();

  const initialPosition = await track.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Scroll projects right" }).click();

  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialPosition);
});

test("scrolls through the horizontal client stories", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".testimonial-track");
  await expect(track.locator(".testimonial-card")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "Scroll client stories left" })).toBeDisabled();

  const initialPosition = await track.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Scroll client stories right" }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialPosition);
});

test("opens the Zappilo project case study", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View Zappilo case study" }).click({ noWaitAfter: true });
  await expect(page.getByRole("status")).toContainText("Opening case study");
  await expect(page).toHaveURL(/\/projects\/zappilo\/$/);
  await expect(page.getByRole("heading", { name: "Zappilo", exact: true })).toBeVisible();
  await expect(page.getByText("AI Communication Platform", { exact: true })).toBeVisible();
  await expect(page.getByAltText("Zappilo live landing page")).toBeVisible();

  await page.getByRole("tab", { name: /CRM & Opportunities/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Contact automatically enriched");

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the Zappilo case study from the project title", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Zappilo - AI Communication Platform", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/zappilo\/$/);
  await expect(page.getByRole("heading", { name: "Zappilo", exact: true })).toBeVisible();
});

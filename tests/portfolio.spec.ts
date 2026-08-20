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

test("scrolls through all four featured projects", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".project-track");
  await expect(track.locator(".project-card")).toHaveCount(4);
  await expect(track).toContainText("MSL Lab - Staff Operations Platform");
  await expect(page.getByRole("button", { name: "Scroll projects left" })).toBeDisabled();

  const initialPosition = await track.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Scroll projects right" }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialPosition);
});

test("scrolls through the horizontal client stories", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".testimonial-track");
  await expect(track.locator(".testimonial-card")).toHaveCount(6);
  await expect(track).toContainText("Safquat");
  await expect(track).toContainText("Mohamed Saad");
  await expect(track).toContainText("Personal Cost Management Client · Dubai, UAE");
  await expect(track).toContainText("One Lifestyle BD");
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

test("opens and sorts the complete project archive", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View All Projects" }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.getByRole("heading", { name: "All Projects" })).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "View One Lifestyle BD case study" })).toHaveAttribute(
    "href",
    "/projects/one-lifestyle/",
  );

  await page.getByLabel("Sort projects").selectOption("az");
  await expect(page.locator("main article").first().getByRole("heading")).toContainText("MSL Lab - Staff Operations Platform");

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});


test("opens the private MSL Lab case study", async ({ page }) => {
  await page.goto("/");

  const projectLink = page.getByRole("link", { name: "View MSL Lab case study" });
  await expect(projectLink).toHaveAttribute("href", "/projects/msl-lab/");
  await projectLink.evaluate((link) => (link as HTMLAnchorElement).click());
  await expect(page.getByRole("status")).toContainText("Opening case study");

  const detailPage = await page.context().newPage();
  await detailPage.goto("/projects/msl-lab/");
  await expect(detailPage).toHaveURL(/\/projects\/msl-lab\/$/);
  await expect(detailPage.getByRole("heading", { name: "MSL Lab", exact: true })).toBeVisible();
  await expect(detailPage.getByAltText("MSL Lab BuildFlow staff workspace with sanitized data").first()).toBeVisible();

  const liveProduct = detailPage.getByRole("link", { name: "Visit Live Product" }).first();
  await expect(liveProduct).toHaveAttribute("href", "https://lab.mohuls.com/login");
  await expect(liveProduct).toHaveAttribute("target", "_blank");

  await detailPage.getByRole("tab", { name: /Product registry/ }).click();
  await expect(detailPage.getByRole("tabpanel")).toContainText("Every application has an operational record");

  const sizes = await detailPage.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
  await detailPage.close();
});

test("opens the One Lifestyle commerce case study", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View One Lifestyle BD case study" }).evaluate((link) => (link as HTMLAnchorElement).click());
  await expect(page.getByRole("status")).toContainText("Opening case study");
  await expect(page).toHaveURL(/\/projects\/one-lifestyle\/$/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "One Lifestyle BD", exact: true })).toBeVisible();
  await expect(page.getByAltText("One Lifestyle Bangladesh live storefront")).toBeVisible();

  await page.getByRole("tab", { name: /Purchase/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("AamarPay and bKash");

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});


test("opens the Personal Cost Management case study", async ({ page }) => {
  await page.goto("/");

  const projectLink = page.getByRole("link", { name: "View Personal Cost Management case study" });
  await expect(projectLink).toHaveAttribute("href", "/projects/cost-manager/");
  await projectLink.evaluate((link) => (link as HTMLAnchorElement).click());
  await expect(page.getByRole("status")).toContainText("Opening case study");

  const detailPage = await page.context().newPage();
  await detailPage.goto("/projects/cost-manager/");
  await expect(detailPage).toHaveURL(/\/projects\/cost-manager\/$/);
  await expect(detailPage.getByRole("heading", { name: "Personal Cost Management", exact: true })).toBeVisible();
  await expect(detailPage.getByAltText("Personal Cost Management desktop dashboard")).toBeVisible();

  await detailPage.getByRole("tab", { name: /Reports/ }).click();
  await expect(detailPage.getByRole("tabpanel")).toContainText("Cash-flow and savings visibility");

  const sizes = await detailPage.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
  await detailPage.close();
});

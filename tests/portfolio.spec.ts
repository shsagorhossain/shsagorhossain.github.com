import { expect, test } from "@playwright/test";

test("renders the portfolio without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sagor Hossain" })).toBeVisible();
  await expect(page.getByAltText("Sagor Hossain")).toBeVisible();
  const firstClientStory = page.locator('.testimonial-card:not([aria-hidden="true"])').first();
  await expect(firstClientStory).toContainText("Arshad Sayed");
  await expect(firstClientStory).toContainText("Zappilo Client · Dubai, UAE");

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

test("scrolls through all six featured projects", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".project-track");
  await expect(track.locator(".project-card")).toHaveCount(6);
  await expect(track.locator(".project-card h3")).toHaveText([
    "Zappilo - AI Communication Platform",
    "One Lifestyle BD - E-Commerce Platform",
    "BounceZip - Email Verification Platform",
    "MSL Lab - Staff Operations Platform",
    "Mohuls - Business Software Ecosystem",
    "Personal Cost Management System",
  ]);
  await expect(page.getByRole("button", { name: "Scroll projects left" })).toBeDisabled();

  const initialPosition = await track.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Scroll projects right" }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialPosition);
});

test("scrolls through the horizontal client stories", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".testimonial-track");
  await expect(track.locator('.testimonial-card:not([aria-hidden="true"])')).toHaveCount(6);
  await expect(track.locator('.testimonial-card[aria-hidden="true"]')).toHaveCount(6);
  await expect(track).toContainText("Safquat");
  await expect(track).toContainText("Mohamed Saad");
  await expect(track).toContainText("Humaun Kabir");
  await expect(track).toContainText("MSL Lab + Mohuls.com");
  await expect(track).toContainText("Nasir Hosain");
  await expect(track).toContainText("BounceZip Client · Chittagong, Bangladesh");
  await expect(track).toContainText("Roufur Rabin");
  await expect(track).toContainText("Trusty Client · Bangladesh");
  await expect(track).toContainText("CEO, Mohuls Soft Limited");
  await expect(track).toContainText("Personal Cost Management Client · Dubai, UAE");
  await expect(track).toContainText("One Lifestyle BD");
  await expect(page.getByRole("button", { name: "Scroll client stories left" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Scroll client stories right" })).toBeEnabled();

  const initialPosition = await track.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Scroll client stories right" }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialPosition);
});

test("continuously advances client stories and respects the pause control", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".testimonial-track");
  await track.scrollIntoViewIfNeeded();
  const pauseButton = page.getByRole("button", { name: "Pause automatic client story scrolling" });
  await expect(pauseButton).toBeVisible();

  const initialPosition = await track.evaluate((element) => element.scrollLeft);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft), { timeout: 7000 }).toBeGreaterThan(initialPosition);

  await pauseButton.click();
  const resumeButton = page.getByRole("button", { name: "Resume automatic client story scrolling" });
  await expect(resumeButton).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(700);
  const pausedPosition = await track.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(5800);
  await expect(track).toHaveJSProperty("scrollLeft", pausedPosition);
});

test("continues from the final client story into the first without rewinding", async ({ page }) => {
  await page.goto("/");

  const track = page.locator(".testimonial-track");
  await track.scrollIntoViewIfNeeded();
  const loopPoint = await track.evaluate((element) => {
    const cards = element.querySelectorAll<HTMLElement>(".testimonial-card");
    const firstCard = cards[0];
    const firstDuplicate = cards[6];
    element.style.scrollBehavior = "auto";
    const boundary = firstDuplicate.offsetLeft - firstCard.offsetLeft;
    element.scrollLeft = boundary - 2;
    return boundary;
  });
  expect(loopPoint).toBeGreaterThan(0);

  await expect.poll(() => track.evaluate((element) => element.scrollLeft), { timeout: 2000 }).toBeLessThan(20);
  await expect(track.locator('.testimonial-card[aria-hidden="true"]').first()).toContainText("Arshad Sayed");
});

test("opens the Zappilo project case study", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View Zappilo case study" }).evaluate((link) => (link as HTMLAnchorElement).click());
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

test("clears the project loading state after returning with browser back", async ({ page }) => {
  await page.goto("/");

  const projectCard = page.locator(".project-card").filter({ hasText: "Zappilo - AI Communication Platform" });
  await projectCard.getByRole("link", { name: "View Zappilo case study" }).click({ noWaitAfter: true });
  await expect(page).toHaveURL(/\/projects\/zappilo\/$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(projectCard).not.toHaveClass(/is-loading/);
  await expect(page.getByText("Opening details", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("opens and sorts the complete project archive", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View All Projects" }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.getByRole("heading", { name: "All Projects" })).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(6);
  await expect(page.locator("main article h3")).toHaveText([
    "Zappilo - AI Communication Platform",
    "One Lifestyle BD - E-Commerce Platform",
    "BounceZip - Email Verification Platform",
    "MSL Lab - Staff Operations Platform",
    "Mohuls - Business Software Ecosystem",
    "Personal Cost Management System",
  ]);
  await expect(page.getByRole("link", { name: "View One Lifestyle BD case study" })).toHaveAttribute(
    "href",
    "/projects/one-lifestyle/",
  );
  await expect(page.getByRole("link", { name: "View Mohuls case study" })).toHaveAttribute(
    "href",
    "/projects/mohuls/",
  );
  await expect(page.getByRole("link", { name: "View BounceZip case study" })).toHaveAttribute(
    "href",
    "/projects/bouncezip/",
  );

  await page.getByLabel("Sort projects").selectOption("az");
  await expect(page.locator("main article").first().getByRole("heading")).toContainText("BounceZip - Email Verification Platform");

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

test("opens the Mohuls business software ecosystem case study", async ({ page }) => {
  await page.goto("/");

  const projectLink = page.getByRole("link", { name: "View Mohuls case study" });
  await expect(projectLink).toHaveAttribute("href", "/projects/mohuls/");
  await projectLink.evaluate((link) => (link as HTMLAnchorElement).click());
  await expect(page.getByRole("status")).toContainText("Opening case study");

  const detailPage = await page.context().newPage();
  await detailPage.goto("/projects/mohuls/");
  await expect(detailPage).toHaveURL(/\/projects\/mohuls\/$/);
  await expect(detailPage.getByRole("heading", { name: "Mohuls", exact: true })).toBeVisible();
  await expect(detailPage.getByText("Business Software Ecosystem", { exact: true })).toBeVisible();
  await expect(detailPage.getByAltText("Mohuls live homepage presenting the connected software suite").first()).toBeVisible();

  const liveProduct = detailPage.getByRole("link", { name: "Visit Live Product" }).first();
  await expect(liveProduct).toHaveAttribute("href", "https://www.mohuls.com");
  await expect(liveProduct).toHaveAttribute("target", "_blank");

  await detailPage.getByRole("tab", { name: /Codex Tool/ }).click();
  await expect(detailPage.getByRole("tabpanel")).toContainText("AI-assisted chats");

  const sizes = await detailPage.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
  await detailPage.close();
});

test("opens the BounceZip email verification case study", async ({ page }) => {
  await page.goto("/");

  const projectLink = page.getByRole("link", { name: "View BounceZip case study" });
  await expect(projectLink).toHaveAttribute("href", "/projects/bouncezip/");
  await projectLink.evaluate((link) => (link as HTMLAnchorElement).click());
  await expect(page.getByRole("status")).toContainText("Opening case study");

  const detailPage = await page.context().newPage();
  await detailPage.goto("/projects/bouncezip/");
  await expect(detailPage).toHaveURL(/\/projects\/bouncezip\/$/);
  await expect(detailPage.getByRole("heading", { name: "BounceZip", exact: true })).toBeVisible();
  await expect(detailPage.getByText("Email Verification Platform", { exact: true })).toBeVisible();
  await expect(detailPage.getByAltText("BounceZip live homepage with a real-time email verification console").first()).toBeVisible();
  await expect(detailPage.locator("main img")).toHaveCount(5);

  const liveProduct = detailPage.getByRole("link", { name: "Visit Live Product" }).first();
  await expect(liveProduct).toHaveAttribute("href", "https://bouncezip.com");
  await expect(liveProduct).toHaveAttribute("target", "_blank");

  await detailPage.getByRole("tab", { name: /Catch-all/ }).click();
  await expect(detailPage.getByRole("tabpanel")).toContainText("Accept-all detected");
  await expect(detailPage.getByRole("tabpanel")).toContainText("Send with caution");

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

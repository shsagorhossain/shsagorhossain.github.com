import { expect, test, type Route } from "@playwright/test";

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

test("keeps homepage anchor destinations clear of the fixed header", async ({ page }, testInfo) => {
  await page.goto("/");

  const useNavigationLink = async (label: string) => {
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("navigation", { name: "Primary navigation" }).last().getByRole("link", { name: new RegExp(label) }).click();
      return;
    }

    await page.locator(".nav-links").getByRole("link", { name: label, exact: true }).click();
  };

  await useNavigationLink("Projects");
  await expect(page).toHaveURL(/#projects$/);
  await page.waitForTimeout(850);

  const projectPosition = await page.evaluate(() => ({
    targetTop: document.querySelector("#projects")?.getBoundingClientRect().top ?? -1,
    headerBottom: document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0,
  }));
  expect(projectPosition.targetTop).toBeGreaterThanOrEqual(projectPosition.headerBottom + 12);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);

  const homePosition = await page.evaluate(() => ({
    contentTop: document.querySelector(".hero-copy")?.getBoundingClientRect().top ?? -1,
    headerBottom: document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0,
  }));
  expect(homePosition.contentTop).toBeGreaterThanOrEqual(homePosition.headerBottom);

  await useNavigationLink("Skills");
  await expect(page).toHaveURL(/#skills$/);
  await page.waitForTimeout(850);

  const skillsPosition = await page.evaluate(() => ({
    targetTop: document.querySelector("#skills")?.getBoundingClientRect().top ?? -1,
    headerBottom: document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0,
    heroScrollTop: document.querySelector("#home")?.scrollTop ?? -1,
  }));
  expect(skillsPosition.targetTop).toBeGreaterThanOrEqual(skillsPosition.headerBottom + 12);
  expect(skillsPosition.heroScrollTop).toBe(0);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);

  const restoredPosition = await page.evaluate(() => ({
    contentTop: document.querySelector(".hero-copy")?.getBoundingClientRect().top ?? -1,
    headerBottom: document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0,
    heroScrollTop: document.querySelector("#home")?.scrollTop ?? -1,
  }));
  expect(restoredPosition.contentTop).toBeGreaterThanOrEqual(restoredPosition.headerBottom);
  expect(restoredPosition.heroScrollTop).toBe(0);
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

test("shows one featured insight and supports manual carousel navigation", async ({ page }) => {
  await page.goto("/");

  const insightsSection = page.locator("#insights");
  const carousel = insightsSection.getByRole("region", { name: "Featured insights" });
  const activeCard = carousel.locator(".insight-feature-card");
  await expect(insightsSection.getByRole("heading", { name: "Insights", exact: true })).toBeVisible();
  await expect(insightsSection.locator(".insight-category-list li")).toHaveCount(10);
  await expect(insightsSection.locator(".insight-category-icon svg")).toHaveCount(10);
  await expect(activeCard).toHaveCount(1);
  await expect(insightsSection).toContainText("Software Engineering");
  await expect(insightsSection).toContainText("4 Published");
  await expect(carousel.locator(".insight-carousel-pages button")).toHaveCount(4);
  await expect(carousel.locator(".insight-carousel-count")).toHaveCount(0);
  await expect(carousel.getByRole("button", { name: "Show previous insight" })).toBeVisible();
  await expect(carousel.getByRole("button", { name: "Show next insight" })).toBeVisible();
  await expect(carousel.getByRole("button", { name: "Pause insight rotation" })).toBeVisible();
  await expect(carousel.getByRole("link", { name: "Enter the Insight Index" })).toHaveAttribute("href", "/insights/");

  const activeCover = activeCard.locator(".insight-cover");
  const imageSkeleton = activeCover.locator('[data-image-skeleton="home-insight"]');
  await expect(imageSkeleton).toHaveCount(1);
  await expect(imageSkeleton).toHaveAttribute("data-loaded", "true");
  await expect(activeCover.locator(".insight-cover-image")).toHaveClass(/is-loaded/);

  await page.waitForTimeout(150);
  const initialSlug = await carousel.getAttribute("data-active-insight");
  const initialTurnSide = await carousel.getAttribute("data-turn-side");
  expect(initialSlug).toBeTruthy();
  expect(initialTurnSide).toBeTruthy();

  await carousel.getByRole("button", { name: "Show next insight" }).click();
  await expect(carousel).not.toHaveAttribute("data-active-insight", initialSlug!);
  await expect(carousel).not.toHaveAttribute("data-turn-side", initialTurnSide!);
  await expect(activeCard).toHaveCount(1);
  const nextTurnSide = await carousel.getAttribute("data-turn-side");
  await carousel.getByRole("button", { name: "Show previous insight" }).click();
  await expect(carousel).toHaveAttribute("data-active-insight", initialSlug!);
  await expect(carousel).not.toHaveAttribute("data-turn-side", nextTurnSide!);
  await expect(activeCard).toHaveCount(1);

  const activeTitle = (await carousel.locator(".insight-feature-copy h3").textContent())?.trim();
  const articleLink = carousel.getByRole("link", { name: "Read Insight", exact: true });
  const articlePath = await articleLink.getAttribute("href");
  expect(activeTitle).toBeTruthy();
  expect(articlePath).toBeTruthy();

  await Promise.all([
    page.waitForURL((url) => url.pathname === articlePath, { timeout: 15000 }),
    articleLink.click(),
  ]);
  await expect(page.getByRole("heading", { name: activeTitle!, level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Article contents" })).toBeVisible();

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("keeps the homepage insight skeleton visible until its image loads", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  const heldImageRoutes: Route[] = [];
  let holdInsightImages = true;
  await page.route(
    (url) => url.pathname.startsWith("/insights/") && url.pathname.endsWith(".webp"),
    async (route) => {
      if (holdInsightImages) {
        heldImageRoutes.push(route);
        return;
      }

      await route.continue();
    },
  );

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);

  await expect(page.locator("#insights")).toBeAttached();
  await page.evaluate(() => document.querySelector("#insights")?.scrollIntoView({ block: "center" }));
  const carousel = page.getByRole("region", { name: "Featured insights" });
  const activeCard = carousel.locator(".insight-feature-card");
  await expect(activeCard).toHaveCount(1);
  await expect.poll(() => heldImageRoutes.length).toBeGreaterThan(0);

  const skeleton = activeCard.locator('[data-image-skeleton="home-insight"]');
  await expect(skeleton).toBeVisible();
  await expect(skeleton).toHaveAttribute("data-loaded", "false");

  holdInsightImages = false;
  await Promise.allSettled(heldImageRoutes.map((route) => route.continue()));

  await expect(skeleton).toHaveAttribute("data-loaded", "true");
  await expect(activeCard.locator(".insight-cover-image")).toHaveClass(/is-loaded/);
});

test("automatically rotates featured insights and can be paused", async ({ page }) => {
  await page.goto("/");

  const carousel = page.getByRole("region", { name: "Featured insights" });
  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const initialSlug = await carousel.getAttribute("data-active-insight");
  await expect.poll(() => carousel.getAttribute("data-active-insight"), { timeout: 5000 }).not.toBe(initialSlug);

  await carousel.getByRole("button", { name: "Pause insight rotation" }).click();
  await expect(carousel.getByRole("button", { name: "Play insight rotation" })).toBeVisible();
  const pausedSlug = await carousel.getAttribute("data-active-insight");
  await page.waitForTimeout(3300);
  await expect(carousel).toHaveAttribute("data-active-insight", pausedSlug!);
});

test("browses, filters, and opens the dedicated Insights Index", async ({ page }) => {
  await page.goto("/insights/");

  await expect(page.getByRole("heading", { name: "Insights Index", level: 1 })).toBeVisible();
  const spotlight = page.locator("[data-spotlight-insight]");
  await expect(spotlight).toHaveAttribute("data-spotlight-ready", "true");
  const firstSpotlight = await spotlight.getAttribute("data-spotlight-insight");
  expect(firstSpotlight).toBeTruthy();
  await page.reload();
  await expect(spotlight).toHaveAttribute("data-spotlight-ready", "true");
  await expect(spotlight).not.toHaveAttribute("data-spotlight-insight", firstSpotlight!);
  await expect(page.getByText("4", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Filter insights by category" }).getByRole("button")).toHaveCount(11);

  const indexPanel = page.locator("[data-view-mode]");
  const articles = page.locator("main article");
  await expect(indexPanel).toHaveAttribute("data-result-count", "4");
  await expect(articles).toHaveCount(4);
  const readActions = articles.getByRole("link", { name: "Read Insight", exact: true });
  await expect(readActions).toHaveCount(4);
  const actionWidthRatios = await readActions.evaluateAll((links) => links.map((link) => {
    const footer = link.closest("footer");
    return footer ? link.getBoundingClientRect().width / footer.getBoundingClientRect().width : 0;
  }));
  expect(actionWidthRatios.every((ratio) => ratio > 0.98)).toBe(true);

  await page.getByRole("searchbox", { name: "Search insights" }).fill("idempotent");
  await expect(indexPanel).toHaveAttribute("data-result-count", "1");
  await expect(articles).toHaveCount(1);
  await expect(articles.getByRole("heading", { name: "Building Idempotent APIs for Payments, Webhooks, and Automation" })).toBeVisible();

  await page.getByRole("button", { name: "Clear insight search" }).click();
  await page.getByRole("button", { name: /DevOps & Cloud/ }).click();
  await expect(indexPanel).toHaveAttribute("data-result-count", "0");
  await expect(articles).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No notes found in this lane" })).toBeVisible();

  await page.getByRole("button", { name: "Reset index" }).last().click();
  await expect(indexPanel).toHaveAttribute("data-result-count", "4");
  await page.getByRole("button", { name: "List view" }).click();
  await expect(indexPanel).toHaveAttribute("data-view-mode", "list");

  const firstArticle = articles.first();
  const firstTitle = (await firstArticle.getByRole("heading", { level: 3 }).textContent())?.trim();
  expect(firstTitle).toBeTruthy();
  const firstTitleLink = firstArticle.getByRole("heading", { level: 3 }).getByRole("link");
  const destination = await firstTitleLink.getAttribute("href");
  expect(destination).toBeTruthy();

  const navigation = page.waitForURL((url) => url.pathname === destination, { timeout: 15000 });
  await firstTitleLink.click();
  await navigation;
  await expect(page.getByRole("heading", { name: firstTitle!, level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to insights" }).first()).toHaveAttribute("href", "/insights/");

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("shows the live Insights skeleton until artwork finishes loading", async ({ page }) => {
  let releaseImages: () => void = () => undefined;
  const imageGate = new Promise<void>((resolve) => {
    releaseImages = resolve;
  });

  await page.route("**/insights/*.webp", async (route) => {
    await imageGate;
    await route.continue();
  });

  await page.goto("/insights/", { waitUntil: "domcontentloaded" });
  const spotlightSkeleton = page.locator('[data-image-skeleton="spotlight"]');
  await expect(spotlightSkeleton).toBeVisible();
  await expect(spotlightSkeleton).toHaveAttribute("data-loaded", "false");

  releaseImages();
  await expect(spotlightSkeleton).toHaveAttribute("data-loaded", "true", { timeout: 10000 });
  await expect(spotlightSkeleton).toBeHidden();

  await page.locator("#library").scrollIntoViewIfNeeded();
  const cardSkeleton = page.locator('[data-image-skeleton="card"]').first();
  await expect(cardSkeleton).toHaveAttribute("data-loaded", "true", { timeout: 10000 });
});

test("opens the modular monolith insight", async ({ page }) => {
  await page.goto("/insights/designing-a-modular-monolith-that-can-grow-with-your-product/");

  await expect(page.getByRole("heading", { name: "Designing a Modular Monolith That Can Grow with Your Product", level: 1 })).toBeVisible();
  await expect(page.getByText("10 min read", { exact: true })).toBeVisible();
  await expect(page.getByAltText(/unified architectural model assembled from distinct connected modules/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Extract a service only when the evidence is clear" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A practical modularity review" })).toBeVisible();
  await expect(page.getByAltText("A unified software architecture divided into six distinct business modules connected through narrow contracts")).toBeVisible();
  await expect(page.getByAltText("A well-bounded module moving from a unified architecture into an independently operated service through a controlled connection")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(7);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(9);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the idempotent APIs insight", async ({ page }) => {
  await page.goto("/insights/building-idempotent-apis-for-payments-webhooks-and-automation/");

  await expect(page.getByRole("heading", { name: "Building Idempotent APIs for Payments, Webhooks, and Automation", level: 1 })).toBeVisible();
  await expect(page.getByText("May 14, 2026")).toBeVisible();
  await expect(page.getByText("10 min read")).toBeVisible();
  await expect(page.getByAltText("Repeated request capsules passing through one precision gateway to produce a single recorded outcome")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Make the first write atomic" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "An idempotency review before release" })).toBeVisible();
  await expect(page.getByAltText("A request token being registered with a durable key before an identical retry receives the preserved result")).toBeVisible();
  await expect(page.getByAltText("Two concurrent request capsules meeting one transaction lock that protects a single committed result")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(8);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(9);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the reliable background jobs insight", async ({ page }) => {
  await page.goto("/insights/designing-reliable-background-jobs-with-retries-and-dead-letter-queues/");

  await expect(page.getByRole("heading", { name: "Designing Reliable Background Jobs with Retries and Dead-Letter Queues", level: 1 })).toBeVisible();
  await expect(page.getByText("February 7, 2026")).toBeVisible();
  await expect(page.getByText("11 min read")).toBeVisible();
  await expect(page.getByAltText("Handmade paper collage showing jobs moving through workers, retrying, and entering a recovery queue")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Use backoff as traffic control" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Treat the dead-letter queue as a workspace" })).toBeVisible();
  await expect(page.getByAltText("Hand-drawn notebook timeline showing failed job attempts separated by increasing waits before recovery")).toBeVisible();
  await expect(page.getByAltText("Hand-printed workflow showing a damaged job isolated, inspected, repaired, and returned to successful processing")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(8);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(10);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
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

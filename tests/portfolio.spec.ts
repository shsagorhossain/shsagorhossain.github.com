import { expect, test, type Route } from "@playwright/test";

test("renders the portfolio without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sagor Hossain" })).toBeVisible();
  await expect(page.getByAltText("Sagor Hossain")).toBeVisible();
  await page.locator("#testimonials").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-module="stories"]')).toHaveAttribute("data-ready", "true");
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

  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-module="services"]')).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: /Backend Development/ }).click();
  await expect(page.locator(".service-console").getByRole("heading", { name: "Backend Development" })).toBeVisible();
  await expect(page.locator(".service-console")).toContainText("Python");
  await expect(page.locator(".service-console")).toContainText("Django");
});

test("answers the primary client FAQ accessibly", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");

  const faq = page.locator("#faq");
  await faq.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-module="faq"]')).toHaveAttribute("data-ready", "true");
  await expect(faq.getByRole("heading", { name: "Frequently Asked Questions", level: 2 })).toBeVisible();
  const question = faq.getByRole("button", { name: "Can you take my idea and build it into a production-ready product?", exact: true });
  await expect(question).toHaveAttribute("aria-expanded", "true");
  const answer = faq.getByRole("region", { name: "Can you take my idea and build it into a production-ready product?" });
  await expect(answer).toContainText("complete journey");
  await expect(answer).toContainText("Discover");
  await expect(faq.locator(".faq-item h3 > button")).toHaveCount(8);

  const expandButton = answer.getByRole("button", { name: "Expand details for: Can you take my idea and build it into a production-ready product?" });
  await expect(expandButton).toHaveAttribute("aria-haspopup", "dialog");
  await expandButton.click();

  const detailDialog = page.getByRole("dialog", { name: "A complete product journey, with every decision visible." });
  await expect(detailDialog).toBeVisible();
  await expect(detailDialog).toContainText("Five accountable stages");
  await expect(detailDialog).toContainText("Production release");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(detailDialog.getByRole("button", { name: "Close expanded FAQ details" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(detailDialog).toHaveCount(0);
  await expect(expandButton).toBeFocused();

  const technologyQuestion = faq.getByRole("button", { name: "What technologies do you specialize in?", exact: true });
  await technologyQuestion.click();
  const technologyAnswer = faq.getByRole("region", { name: "What technologies do you specialize in?" });
  await expect(technologyAnswer).toContainText("Application");
  await technologyAnswer.getByRole("button", { name: "Expand details for: What technologies do you specialize in?" }).click();
  const technologyDialog = page.getByRole("dialog", { name: "The stack follows the product, not the trend." });
  await expect(technologyDialog).toBeVisible();
  await expect(technologyDialog).toContainText("Four questions before choosing a tool");
  await expect(technologyDialog).toContainText("Product requirements");
  await page.keyboard.press("Escape");
  await expect(technologyDialog).toHaveCount(0);

  const collaborationQuestion = faq.getByRole("button", { name: "How do you usually work with clients?", exact: true });
  await collaborationQuestion.click();
  const collaborationAnswer = faq.getByRole("region", { name: "How do you usually work with clients?" });
  await expect(collaborationAnswer).toContainText("Review");
  await collaborationAnswer.getByRole("button", { name: "Expand details for: How do you usually work with clients?" }).click();
  const collaborationDialog = page.getByRole("dialog", { name: "You always know what is moving and what ships next." });
  await expect(collaborationDialog).toBeVisible();
  await expect(collaborationDialog).toContainText("Five visible collaboration stages");
  await expect(collaborationDialog).toContainText("Feedback loop");
  await page.keyboard.press("Escape");
  await expect(collaborationDialog).toHaveCount(0);

  const codebaseQuestion = faq.getByRole("button", { name: "Can you work with an existing project or codebase?", exact: true });
  await codebaseQuestion.click();
  const codebaseAnswer = faq.getByRole("region", { name: "Can you work with an existing project or codebase?" });
  await expect(codebaseAnswer).toContainText("Stabilize");
  await codebaseAnswer.getByRole("button", { name: "Expand details for: Can you work with an existing project or codebase?" }).click();
  const codebaseDialog = page.getByRole("dialog", { name: "Improve the system without losing what already works." });
  await expect(codebaseDialog).toBeVisible();
  await expect(codebaseDialog).toContainText("Five stages before a confident release");
  await expect(codebaseDialog).toContainText("Baseline protected");
  await page.keyboard.press("Escape");
  await expect(codebaseDialog).toHaveCount(0);

  const fullStackQuestion = faq.getByRole("button", { name: "Can you handle both frontend and backend development?", exact: true });
  await fullStackQuestion.click();
  const fullStackAnswer = faq.getByRole("region", { name: "Can you handle both frontend and backend development?" });
  await expect(fullStackAnswer).toContainText("Backend");
  await fullStackAnswer.getByRole("button", { name: "Expand details for: Can you handle both frontend and backend development?" }).click();
  const fullStackDialog = page.getByRole("dialog", { name: "One product journey, from interface to infrastructure." });
  await expect(fullStackDialog).toBeVisible();
  await expect(fullStackDialog).toContainText("One decision across every layer");
  await expect(fullStackDialog).toContainText("Shared contracts");
  await page.keyboard.press("Escape");
  await expect(fullStackDialog).toHaveCount(0);

  const integrationsQuestion = faq.getByRole("button", { name: "Do you integrate third-party APIs and services?", exact: true });
  await integrationsQuestion.click();
  const integrationsAnswer = faq.getByRole("region", { name: "Do you integrate third-party APIs and services?" });
  await expect(integrationsAnswer).toContainText("Connect");
  await integrationsAnswer.getByRole("button", { name: "Expand details for: Do you integrate third-party APIs and services?" }).click();
  const integrationsDialog = page.getByRole("dialog", { name: "External services should extend the product, not weaken it." });
  await expect(integrationsDialog).toBeVisible();
  await expect(integrationsDialog).toContainText("Five controls around every integration");
  await expect(integrationsDialog).toContainText("Reliable boundaries");
  await page.keyboard.press("Escape");
  await expect(integrationsDialog).toHaveCount(0);

  const deliveryQuestion = faq.getByRole("button", { name: "How do you approach project timelines and delivery?", exact: true });
  await deliveryQuestion.click();
  const deliveryAnswer = faq.getByRole("region", { name: "How do you approach project timelines and delivery?" });
  await expect(deliveryAnswer).toContainText("milestones");
  await deliveryAnswer.getByRole("button", { name: "Expand details for: How do you approach project timelines and delivery?" }).click();
  const deliveryDialog = page.getByRole("dialog", { name: "Timelines built around decisions, not optimistic guesses." });
  await expect(deliveryDialog).toBeVisible();
  await expect(deliveryDialog).toContainText("Five stages from scope to release");
  await expect(deliveryDialog).toContainText("Practical estimates");
  await page.keyboard.press("Escape");
  await expect(deliveryDialog).toHaveCount(0);

  const kickoffQuestion = faq.getByRole("button", { name: "How can I start a project with you?", exact: true });
  await kickoffQuestion.click();
  const kickoffAnswer = faq.getByRole("region", { name: "How can I start a project with you?" });
  await expect(kickoffAnswer).toContainText("short summary");
  await kickoffAnswer.getByRole("button", { name: "Expand details for: How can I start a project with you?" }).click();
  const kickoffDialog = page.getByRole("dialog", { name: "Starting a project should feel clear before it feels complicated." });
  await expect(kickoffDialog).toBeVisible();
  await expect(kickoffDialog).toContainText("Five low-friction steps to begin");
  await expect(kickoffDialog).toContainText("A clear first step");
  await page.keyboard.press("Escape");
  await expect(kickoffDialog).toHaveCount(0);
  await kickoffQuestion.click();
  await expect(kickoffQuestion).toHaveAttribute("aria-expanded", "false");

  const contactLink = faq.getByRole("link", { name: "Let's Talk" });
  await expect(contactLink).toHaveAttribute("href", /Project%20enquiry/);
  await contactLink.scrollIntoViewIfNeeded();
  await expect(contactLink).toBeVisible();

  await fullStackQuestion.click();
  await fullStackQuestion.click();
  await expect(fullStackQuestion).toHaveAttribute("aria-expanded", "false");
  await expect(faq.getByRole("region", { name: "Can you handle both frontend and backend development?" })).toHaveCount(0);

  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('.nav-links a[href="#faq"]')).toHaveAttribute("href", "#faq");

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("animates career metrics to their final values", async ({ page }) => {
  await page.goto("/");

  await page.locator(".stats-wrap").scrollIntoViewIfNeeded();
  await expect(page.getByText("1500+", { exact: true })).toBeVisible();
});

test("scrolls through the featured projects and reaches the project index card", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-module="projects"]')).toHaveAttribute("data-ready", "true");
  const track = page.locator(".project-track");
  await expect(track.locator(".project-card")).toHaveCount(7);
  await expect(track.locator(".project-card h3")).toHaveText([
    "Zappilo - AI Communication Platform",
    "One Lifestyle BD - E-Commerce Platform",
    "BounceZip - Email Verification Platform",
    "LeadsFriday - B2B Lead Generation Platform",
    "MSL Lab - Staff Operations Platform",
    "Mohuls - Business Software Ecosystem",
    "Personal Cost Management System",
  ]);
  await expect(page.getByRole("button", { name: "Scroll projects left" })).toBeDisabled();

  if ((page.viewportSize()?.width ?? 0) <= 640) {
    const [trackBox, firstCardBox, secondCardBox, nextButtonBox] = await Promise.all([
      track.boundingBox(),
      track.locator(".project-card").first().boundingBox(),
      track.locator(".project-card").nth(1).boundingBox(),
      page.getByRole("button", { name: "Scroll projects right" }).boundingBox(),
    ]);
    expect(trackBox && firstCardBox && secondCardBox && nextButtonBox).toBeTruthy();
    expect(trackBox!.x + trackBox!.width - secondCardBox!.x).toBeGreaterThan(55);
    expect(Math.abs((firstCardBox!.y + firstCardBox!.height / 2) - (nextButtonBox!.y + nextButtonBox!.height / 2))).toBeLessThan(2);
    await expect(page.getByRole("button", { name: "Scroll projects right" })).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(page.getByRole("button", { name: "Scroll projects right" })).toHaveCSS("border-top-width", "0px");
  }

  const initialPosition = await track.evaluate((element) => element.scrollLeft);
  await page.getByRole("button", { name: "Scroll projects right" }).click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialPosition);

  await track.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  const indexCard = track.locator(".project-index-card");
  await expect(indexCard).toBeInViewport();
  await expect(indexCard.getByRole("heading", { name: "You have reached the end of the featured selection." })).toBeVisible();
  await expect(indexCard.locator(".project-index-orbit svg")).toHaveCount(3);
  const indexLink = indexCard.getByRole("link", { name: "View All Projects" });
  await expect(indexLink).toHaveAttribute("href", "/projects/");
  await indexLink.click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.getByRole("heading", { name: "All Projects" })).toBeVisible();
});

test("opens the LeadsFriday project case study", async ({ page }) => {
  await page.goto("/projects/leadsfriday/");

  await expect(page.getByRole("heading", { name: "LeadsFriday", level: 1 })).toBeVisible();
  await expect(page.getByText("A lead generation platform built to move from targeted discovery to usable outreach data.", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit live product" })).toHaveAttribute("href", "https://app.leadsfriday.com");
  await expect(page.getByRole("img", { name: "LeadsFriday live product entry screen", exact: true })).toHaveCount(1);
  await expect(page.locator("img[alt*='LeadsFriday live']")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "One workspace for the work around a lead." })).toBeVisible();

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("shows one featured insight and supports manual carousel navigation", async ({ page }) => {
  await page.goto("/");

  const insightsSection = page.locator("#insights");
  await insightsSection.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-module="insights"]')).toHaveAttribute("data-ready", "true");
  const carousel = insightsSection.getByRole("region", { name: "Featured insights" });
  const activeCard = carousel.locator(".insight-feature-card");
  await expect(insightsSection.getByRole("heading", { name: "Insights", exact: true })).toBeVisible();
  await expect(insightsSection.locator(".insight-category-list li")).toHaveCount(10);
  await expect(insightsSection.locator(".insight-category-icon svg")).toHaveCount(10);
  await expect(activeCard).toHaveCount(1);
  await expect(insightsSection).toContainText("Software Engineering");
  await expect(insightsSection).toContainText("12 Published");
  await expect(carousel.locator(".insight-carousel-pages button")).toHaveCount(6);
  await expect(carousel.locator(".insight-carousel-count")).toHaveCount(0);
  await expect(carousel).toHaveAttribute("data-slide-kind", "insight");
  const curatedSlugs = (await carousel.getAttribute("data-curated-insights"))?.split(",") ?? [];
  expect(curatedSlugs).toHaveLength(5);
  expect(new Set(curatedSlugs).size).toBe(5);
  await expect(carousel.getByRole("button", { name: "Show previous insight" })).toBeVisible();
  await expect(carousel.getByRole("button", { name: "Show next insight" })).toBeVisible();
  const pauseRotation = carousel.getByRole("button", { name: "Pause insight rotation" });
  await expect(pauseRotation).toBeVisible();
  await pauseRotation.click();
  await expect(carousel.getByRole("button", { name: "Play insight rotation" })).toBeVisible();
  await expect(carousel.getByRole("link", { name: "Enter the Insight Index" })).toHaveAttribute("href", "/insights/");

  await page.waitForTimeout(850);
  await expect(activeCard).toHaveCount(1);

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

  await page.locator("#insights").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-module="insights"]')).toHaveAttribute("data-ready", "true");
  const carousel = page.getByRole("region", { name: "Featured insights" });
  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const initialSlug = await carousel.getAttribute("data-active-insight");
  await expect.poll(() => carousel.getAttribute("data-active-insight"), { timeout: 7000 }).not.toBe(initialSlug);

  await carousel.getByRole("button", { name: "Pause insight rotation" }).click();
  await expect(carousel.getByRole("button", { name: "Play insight rotation" })).toBeVisible();
  const pausedSlug = await carousel.getAttribute("data-active-insight");
  await page.waitForTimeout(3300);
  await expect(carousel).toHaveAttribute("data-active-insight", pausedSlug!);
});

test("ends the homepage insight selection with a complete index invitation", async ({ page }) => {
  await page.goto("/");

  await page.locator("#insights").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-home-module="insights"]')).toHaveAttribute("data-ready", "true");
  const carousel = page.getByRole("region", { name: "Featured insights" });
  await carousel.scrollIntoViewIfNeeded();
  await carousel.getByRole("button", { name: "Pause insight rotation" }).click();
  await carousel.locator(".insight-carousel-pages button.is-index").evaluate((button: HTMLButtonElement) => button.click());

  await expect(carousel).toHaveAttribute("data-active-insight", "insights-index");
  await expect(carousel).toHaveAttribute("data-slide-kind", "index");
  await expect(carousel.getByRole("heading", { name: "This five-note selection ends here.", level: 3 })).toBeVisible();
  await expect(carousel).toContainText("End of curated selection");
  await expect(carousel).toContainText("05 / 05");
  await expect(carousel).toContainText("all 12 engineering notes");
  await expect(carousel.locator(".insight-index-end-orbit svg")).toHaveCount(3);
  await expect(carousel.locator(".insight-index-end-art img")).toBeVisible();
  await expect(carousel.getByRole("link", { name: "Enter the Insights Index", exact: true })).toHaveAttribute("href", "/insights/");
  await expect(carousel.getByRole("button", { name: "Show previous insight" })).toHaveCount(0);
  await expect(carousel.getByRole("button", { name: "Show next insight" })).toHaveCount(0);

  await carousel.getByRole("button", { name: "Replay insight selection" }).click();
  await expect(carousel).toHaveAttribute("data-slide-kind", "insight");
  await expect(carousel.getByRole("button", { name: "Pause insight rotation" })).toBeVisible();
  await expect(carousel.getByRole("button", { name: "Show previous insight" })).toBeVisible();
  await expect(carousel.getByRole("button", { name: "Show next insight" })).toBeVisible();
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
  await expect(page.getByText("12", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Filter insights by category" }).getByRole("button")).toHaveCount(11);

  const indexPanel = page.locator("[data-view-mode]");
  const articles = page.locator("main article");
  await expect(indexPanel).toHaveAttribute("data-result-count", "12");
  await expect(articles).toHaveCount(12);
  const readActions = articles.getByRole("link", { name: "Read Insight", exact: true });
  await expect(readActions).toHaveCount(12);
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
  await expect(indexPanel).toHaveAttribute("data-result-count", "12");
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

test("opens the API contracts insight", async ({ page }) => {
  await page.goto("/insights/writing-api-contracts-that-frontend-and-backend-teams-can-trust/");

  await expect(page.getByRole("heading", { name: "Writing API Contracts That Frontend and Backend Teams Can Trust", level: 1 })).toBeVisible();
  await expect(page.getByText("November 19, 2025")).toBeVisible();
  await expect(page.getByText("12 min read")).toBeVisible();
  await expect(page.getByAltText("Two complementary technical systems exchanging precisely matched components through one shared transparent specification")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Make errors part of the public design" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test the promises at the boundary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "An API contract review before release" })).toBeVisible();
  await expect(page.getByAltText("Layered teal and amber specification sheets preserving a shared aligned core while adding compatible extensions")).toBeVisible();
  await expect(page.getByAltText("Teal client components and amber server components being checked against one central precision gauge with a mismatch isolated for review")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(10);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the data consistency insight", async ({ page }) => {
  await page.goto("/insights/maintaining-data-consistency-across-complex-business-workflows/");

  await expect(page.getByRole("heading", { name: "Maintaining Data Consistency Across Complex Business Workflows", level: 1 })).toBeVisible();
  await expect(page.getByText("August 3, 2025")).toBeVisible();
  await expect(page.getByText("13 min read")).toBeVisible();
  await expect(page.getByAltText("Hand-carved linocut landscape showing guarded record streams converging on one authoritative ledger")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Close the gap between commit and publish" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reconciliation is part of the design" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A consistency review before release" })).toBeVisible();
  await expect(page.getByAltText("Cyanotype diagram showing a business record and outbox record committed inside one boundary before a worker delivers the event externally")).toBeVisible();
  await expect(page.getByAltText("Embroidered workflow map with forward state transitions, a compensating failure path, and a reconciliation loop")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(10);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the production observability insight", async ({ page }) => {
  await page.goto("/insights/observability-that-helps-engineers-solve-real-production-problems/");

  await expect(page.getByRole("heading", { name: "Observability That Helps Engineers Solve Real Production Problems", level: 1 })).toBeVisible();
  await expect(page.getByText("April 21, 2025")).toBeVisible();
  await expect(page.getByText("13 min read")).toBeVisible();
  await expect(page.getByAltText("Detailed retro operations manual mapping logs, metrics, and traces across a failed checkout request with one shared correlation ID")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Structured logs should tell a business story" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Traces explain one journey and its cost" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Alerts should protect human attention" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "An observability review before release" })).toBeVisible();
  await expect(page.getByAltText("Detailed field-engineering board tracing request req 82AF through five spans and identifying an HTTP 502 from the payment API")).toBeVisible();
  await expect(page.getByAltText("Detailed mechanical decision board routing traffic, errors, latency, and saturation through an SLO into page, ticket, or dashboard actions")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(10);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the zero-downtime database migrations insight", async ({ page }) => {
  await page.goto("/insights/planning-zero-downtime-database-migrations/");

  await expect(page.getByRole("heading", { name: "Planning Zero-Downtime Database Migrations", level: 1 })).toBeVisible();
  await expect(page.getByText("December 9, 2024")).toBeVisible();
  await expect(page.getByText("14 min read")).toBeVisible();
  await expect(page.getByAltText("Handcrafted railway diorama showing live application traffic continuing through expand, migrate, verify, and contract database migration stages")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Expand the schema without changing ownership" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Treat the backfill as production traffic" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contract only after rollback has changed shape" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A zero-downtime migration review" })).toBeVisible();
  await expect(page.getByAltText("Three-dimensional paper pop-up explaining compatible expand, migrate, and contract releases with dual writes, backfill, verification, and delayed old-column removal")).toBeVisible();
  await expect(page.getByAltText("Claymation backfill control room showing resumable record batches, throttling, replication lag, verification checks, cutover gate, and read-old rollback path")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(10);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the secure multi-tenant SaaS insight", async ({ page }) => {
  await page.goto("/insights/designing-secure-multi-tenant-saas-architecture/");

  await expect(page.getByRole("heading", { name: "Designing Secure Multi-Tenant SaaS Architecture", level: 1 })).toBeVisible();
  await expect(page.getByText("July 18, 2024")).toBeVisible();
  await expect(page.getByText("14 min read")).toBeVisible();
  await expect(page.getByAltText("Hand-painted architectural cutaway showing three isolated SaaS tenants using shared API, workers, cache, files, and database infrastructure")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Establish tenant context from trusted membership" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Carry isolation beyond the HTTP request" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operate the boundary without bypassing it" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A multi-tenant architecture review" })).toBeVisible();
  await expect(page.getByAltText("Transparent acrylic security model showing authentication, membership resolution, tenant context, action authorization, scoped query, and database policy gates")).toBeVisible();
  await expect(page.getByAltText("Detailed chalkboard architecture map carrying tenant alpha context through job queues, cache keys, file paths, search filters, analytics, quotas, and audits")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(10);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the practical full-stack testing insight", async ({ page }) => {
  await page.goto("/insights/a-practical-testing-strategy-for-full-stack-applications/");

  await expect(page.getByRole("heading", { name: "A Practical Testing Strategy for Full-Stack Applications", level: 1 })).toBeVisible();
  await expect(page.getByText("February 27, 2024")).toBeVisible();
  await expect(page.getByText("14 min read")).toBeVisible();
  await expect(page.getByAltText("Illuminated stained-glass testing architecture surrounding a sign-in, order, payment, and confirmation journey with complementary test layers")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test behavior at the lowest useful boundary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reserve end-to-end tests for critical journeys" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Make the suite part of delivery and production" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A full-stack testing strategy review" })).toBeVisible();
  await expect(page.getByAltText("Handcrafted wooden decision board routing discount rules, repository queries, payment contracts, checkout journeys, and visual styling to appropriate test levels")).toBeVisible();
  await expect(page.getByAltText("Analog film-editing table mapping one six-step checkout browser journey and focused branches for declined cards, double clicks, API timeouts, and expired sessions")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(10);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the intentional responsive interfaces insight", async ({ page }) => {
  await page.goto("/insights/designing-responsive-interfaces-that-feel-intentional-at-every-breakpoint/");

  await expect(page.getByRole("heading", { name: "Designing Responsive Interfaces That Feel Intentional at Every Breakpoint", level: 1 })).toBeVisible();
  await expect(page.getByText("June 12, 2026")).toBeVisible();
  await expect(page.getByText("11 min read")).toBeVisible();
  await expect(page.locator("main")).toContainText("Insight Frontend Development");
  await expect(page.getByAltText("A physical interface system composed across mobile, tablet, laptop, and wide desktop frames on a design workbench")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Let components respond to their context" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stress-test the composition before calling it complete" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A responsive interface review" })).toBeVisible();
  await expect(page.getByAltText("A hand-drawn blueprint showing one interface reorganized through wide, medium, and narrow containers")).toBeVisible();
  await expect(page.getByAltText("A handmade editorial test board examining interface layouts, long content, touch targets, image crops, and multiple screen proportions")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(9);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(9);

  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
});

test("opens the practical Next.js performance playbook", async ({ page }) => {
  await page.goto("/insights/performance-is-user-experience-a-practical-nextjs-optimization-playbook/");

  await expect(page.getByRole("heading", { name: "Performance Is User Experience: A Practical Next.js Optimization Playbook", level: 1 })).toBeVisible();
  await expect(page.getByText("October 16, 2025")).toBeVisible();
  await expect(page.getByText("12 min read")).toBeVisible();
  await expect(page.locator("main")).toContainText("Insight Frontend Development");
  await expect(page.getByAltText("A web page assembled as a precision machine with measured assets traveling along copper delivery paths")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Keep the client boundary deliberately small" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Give the critical route the shortest journey" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A practical Next.js performance review" })).toBeVisible();
  await expect(page.getByAltText("A letterpress transit diagram showing essential page resources on a direct route and optional work branching into deferred paths")).toBeVisible();
  await expect(page.getByAltText("A handcrafted miniature workshop measuring a page, adjusting its assets, and verifying the improved interface")).toBeVisible();
  await expect(page.locator("main article").getByRole("listitem")).toHaveCount(10);
  await expect(page.getByRole("navigation", { name: "Article contents" }).getByRole("link")).toHaveCount(9);

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
  await page.emulateMedia({ reducedMotion: "reduce" });
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

  await page.getByRole("link", { name: "View All Projects" }).first().click();
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

import { expect, test, type Page } from "@playwright/test";

async function recordPrintRequests(page: Page) {
  await page.addInitScript(() => {
    const state = window as typeof window & { cvPrintRequests: { imagesReady: boolean }[] };
    state.cvPrintRequests = [];
    window.print = () => {
      state.cvPrintRequests.push({
        imagesReady: Array.from(document.querySelectorAll<HTMLImageElement>("[data-cv-document] img"))
          .every((image) => image.complete && image.naturalWidth > 0),
      });
    };
  });
}

async function printRequests(page: Page) {
  return page.evaluate(() => (window as typeof window & { cvPrintRequests: { imagesReady: boolean }[] }).cvPrintRequests);
}

test("reads and manually prints the CV without horizontal overflow", async ({ page }) => {
  await recordPrintRequests(page);
  await page.goto("/cv/");
  await expect(page).toHaveTitle("Sagor Hossain - CV");
  await expect(page.getByRole("heading", { name: "Sagor Hossain", exact: true })).toBeVisible();
  await expect(page.getByAltText("Sagor Hossain")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Self-directed software engineering education" })).toBeVisible();
  await expect(page.getByRole("main")).toContainText("Mohuls Soft Limited");
  await expect(page.getByRole("main")).toContainText("Bengali / Hindi / English");
  await expect(page.getByRole("link", { name: "+8801303488968", exact: true })).toHaveAttribute("href", "tel:+8801303488968");
  const print = page.getByRole("button", { name: "Print / Save PDF" });
  await expect(print).toBeEnabled();
  expect(await printRequests(page)).toEqual([]);
  await print.click();
  expect(await printRequests(page)).toEqual([{ imagesReady: true }]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("opens the CV from the homepage and waits for its portrait before printing once", async ({ page }) => {
  await recordPrintRequests(page);
  let releaseImage!: () => void;
  const imageReleased = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route("**/cv/sagor-hossain.webp", async (route) => {
    await imageReleased;
    await route.continue();
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Download CV", exact: true }).click({ noWaitAfter: true });
  await expect(page).toHaveURL(/\/cv\/\?print=1$/);
  await expect(page.getByRole("button", { name: "Preparing CV" })).toBeDisabled();
  expect(await printRequests(page)).toEqual([]);
  releaseImage();
  await expect.poll(() => printRequests(page)).toEqual([{ imagesReady: true }]);
  await expect(page).toHaveURL(/\/cv\/$/);

  await page.reload();
  await expect(page.getByRole("button", { name: "Print / Save PDF" })).toBeEnabled();
  expect(await printRequests(page)).toEqual([]);
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Sagor Hossain", exact: true })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/cv\/$/);
  await expect(page.getByRole("button", { name: "Print / Save PDF" })).toBeEnabled();
  expect(await printRequests(page)).toEqual([]);
});

test("keeps the print action available if the portrait fails to load", async ({ page }) => {
  await recordPrintRequests(page);
  await page.route("**/cv/sagor-hossain.webp", (route) => route.abort());
  await page.goto("/cv/?print=1");
  await expect.poll(() => printRequests(page)).toEqual([{ imagesReady: false }]);
  await expect(page.getByRole("button", { name: "Print / Save PDF" })).toBeEnabled();
  await expect(page.getByRole("heading", { name: "Selected Projects" })).toBeVisible();
});

test("exports the complete CV to two A4 pages without website controls", async ({ page }, testInfo) => {
  await page.goto("/cv/");
  await expect(page.getByRole("button", { name: "Print / Save PDF" })).toBeEnabled();
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("navigation", { name: "CV actions" })).toBeHidden();
  const pdf = await page.pdf({ path: testInfo.outputPath("Sagor-Hossain-CV.pdf"), preferCSSPageSize: true });
  expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)).toHaveLength(2);
  await expect(page.getByRole("heading", { name: "Personal Cost Management System" })).toBeVisible();
});

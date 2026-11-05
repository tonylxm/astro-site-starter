import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
});

for (const path of ["/", "/contact"]) {
  test(`${path} renders at phone width without horizontal scroll`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoHorizontalScroll(page);
  });
}

// A filled honeypot short-circuits before Resend, so this exercises the action without sending mail.
test("contact form posts to the action and redirects to the thank-you state", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Test Bot");
  await page.getByLabel("Email").fill("bot@example.com");
  await page.getByLabel("Message").fill("This is a honeypot test message.");
  await page
    .locator('input[name="company"]')
    .evaluate((el: HTMLInputElement) => (el.value = "Spam Inc"));
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page).toHaveURL(/\/contact\?sent=1$/);
  await expect(page.getByRole("status")).toContainText("Thanks");
});

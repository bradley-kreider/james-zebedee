const { test, expect } = require("@playwright/test");


//test 1
test("page loads and has an H1", async ({ page }, testInfo) => {
    await page.goto("/");

    //assert one visible h1 exists
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    //single screeenshot
    await page.screenshot({
        path: testInfo.outputPath("homepage_h1.png"),
        fullPage: true
    });
});


const { test, expect } = require("@playwright/test");

//test 2
test("page has a Header, Main, and a Nav", async ({ page }, testInfo) => {
    await page.goto("/");

    //assert one visible h1 exists
    const h1 = page.locator("header");
    await expect(h1).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();

    const nav = page.locator("nav");
    await expect(nav).toBeVisible();



    //single screeenshot
    await page.screenshot({
        path: testInfo.outputPath("homepage_header-main-nav.png"),
        fullPage: true
    });
});

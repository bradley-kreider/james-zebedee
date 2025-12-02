//playwright.config.cjs
//CommonJS config for projects with "type": "commonJS"

const {defineConfig} = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests",
    testMatch: ["**/test_*.js"],
    outputDir: "test-results",
    use: {
        baseURL: "http://localhost:4101",
        headless: true,
    }
})
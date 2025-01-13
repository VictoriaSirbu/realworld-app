import { defineConfig } from "@playwright/test";
import { TestOptions } from "./config/customTestOptions";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://localhost:3000",
    apiURL: "http://localhost:3002",
    testIdAttribute: "data-test",
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Test setup",
      testMatch: /setup.spec\.ts/,
      teardown: "Test teardown",
    },
    {
      name: "Test",
      dependencies: ["Test setup"],
    },
    {
      name: "Test teardown",
      testMatch: /teardown.spec\.ts/,
    },
  ],
});

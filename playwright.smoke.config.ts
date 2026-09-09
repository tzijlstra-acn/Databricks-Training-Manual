import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: /smoke\.spec\.ts/,
  fullyParallel: false,
  retries: 1,
  reporter: "github",
  use: {
    baseURL: "https://tzijlstra-acn.github.io/Databricks-Training-Manual",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});

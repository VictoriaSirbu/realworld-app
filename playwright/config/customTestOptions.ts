import { test as base } from "@playwright/test";

export type TestOptions = {
  apiURL: string;
};

export const test = base.extend<TestOptions>({
  apiURL: ["http://localhost:3002", { option: true }],
});

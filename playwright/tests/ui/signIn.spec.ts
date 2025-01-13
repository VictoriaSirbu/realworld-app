import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import { SignInPage } from "../../pageObjects/signInPage";
import { HomePage } from "../../pageObjects/homePage";
import { TestContext } from "../../context/testContext";
import { User } from "../../constants/types";
import { getCurrentUser } from "../../utils/apiUtils";

const user: User = JSON.parse(TestContext.REGISTERED_USER);

let signInPage: SignInPage;
let homePage: HomePage;

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("User signing in tests @ui", () => {
  test.beforeEach("Go to Sign In page", async ({ page }) => {
    signInPage = new SignInPage(page);
    homePage = new HomePage(page);

    await signInPage.goto();
  });

  test("Should log in with existing account", async ({ request, apiURL }) => {
    await test.step("Sign in with existing account", async () => {
      await signInPage.signIn(user);
    });

    await test.step("Verify user is logged in", async () => {
      const currentUser = await getCurrentUser(request, apiURL);
      expect.soft(currentUser.username).toBe(user.username);
    });

    await test.step("Verify user is redirected to Home page", async () => {
      await expect.soft(homePage.username).toHaveText(`@${user.username}`);
      expect.soft(signInPage.page.url()).toContain("/");
    });
  });
});

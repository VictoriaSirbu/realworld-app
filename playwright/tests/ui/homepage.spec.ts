import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import { SignInPage } from "../../pageObjects/signInPage";
import { HomePage } from "../../pageObjects/homePage";
import { TestContext } from "../../context/testContext";
import { User } from "../../constants/types";

const user: User = JSON.parse(TestContext.REGISTERED_USER);

let signInPage: SignInPage;
let homePage: HomePage;

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("Home page tests", () => {
  test.beforeEach("Sign in with existing account @ui", async ({ page }) => {
    signInPage = new SignInPage(page);
    homePage = new HomePage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await homePage.page.waitForURL("/");
  });

  test("User info should be displayed", async () => {
    await test.step("User should see account details", async () => {
      await expect
        .soft(homePage.fullName)
        .toHaveText(`${user.firstName} ${user.lastName.charAt(0)}`);
      await expect.soft(homePage.username).toHaveText(`@${user.username}`);
    });
    await test.step("User should see account balance", async () => {
      await expect.soft(homePage.amountBalance).toHaveText("$0.00");
    });
  });
});

import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import { SignInPage } from "../../pageObjects/signInPage";
import { HomePage } from "../../pageObjects/homePage";
import { MyAccountPage } from "../../pageObjects/myAccountPage";
import { User } from "../../constants/types";
import { TestContext } from "../../context/testContext";
import { generateRandomUser } from "../../utils/userUtils";
import { getCurrentUser } from "../../utils/apiUtils";

const user: User = JSON.parse(TestContext.REGISTERED_USER);
const newUser: User = generateRandomUser();

let signInPage: SignInPage;
let homePage: HomePage;
let myAccountPage: MyAccountPage;

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("My account tests @ui", () => {
  test.beforeEach("Sign in and go to My Account page", async ({ page }) => {
    signInPage = new SignInPage(page);
    homePage = new HomePage(page);
    myAccountPage = new MyAccountPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await homePage.menu.myAccountBtn.click();
  });

  test.afterEach("Restore user details", async () => {
    await homePage.menu.myAccountBtn.click();
    await myAccountPage.updateUserInfo(user);
  });

  test("Should update account user settings", async ({ request, apiURL }) => {
    await test.step("Update user details", async () => {
      await myAccountPage.updateUserInfo(newUser);
    });

    test.step("Verify user is updated", async () => {
      const updatedUser = await getCurrentUser(request, apiURL);
      expect.soft(updatedUser.username).toBe(user.username);
      expect.soft(updatedUser.firstName).toBe(newUser.firstName);
      expect.soft(updatedUser.lastName).toBe(newUser.lastName);
      expect.soft(updatedUser.email).toBe(newUser.email);
      expect.soft(updatedUser.phoneNumber).toBe(newUser.phoneNumber);
    });

    await test.step("Verify user details are updated on Home page", async () => {
      await homePage.goto();
      await expect
        .soft(homePage.fullName)
        .toHaveText(`${newUser.firstName} ${newUser.lastName.charAt(0)}`);
      await expect.soft(homePage.username).toHaveText(`@${user.username}`);
    });
  });
});

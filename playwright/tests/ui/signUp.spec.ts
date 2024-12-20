import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import bcrypt from "bcryptjs";
import { generateRandomUser } from "../../utils/userUtils";
import { SignUpPage } from "../../pageObjects/signUpPage";
import { SignInPage } from "../../pageObjects/signInPage";
import { TestContext } from "../../context/testContext";
import { getUsers, loginByAPI } from "../../utils/apiUtils";

const newUser = generateRandomUser();

let signUpPage: SignUpPage;
let signInPage: SignInPage;
let signedUpUser: any;

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("Account registration tests @ui", () => {
  test.beforeEach("Go to Sign Up page", async ({ page }) => {
    signUpPage = new SignUpPage(page);
    signInPage = new SignInPage(page);
    await signUpPage.goto();
  });

  test("Should register a new account", async ({ request, apiURL }) => {
    await test.step("Register a new account", async () => {
      await signUpPage.signUp(newUser);
    });

    await test.step("Verify user is registered in Database", async () => {
      const users = await getUsers(request, apiURL);
      signedUpUser = users[users.length - 1];
      expect.soft(signedUpUser).toBeDefined();
      expect.soft(signedUpUser).not.toBeNull();
      expect.soft(signedUpUser.firstName).toBe(newUser.firstName);
      expect.soft(signedUpUser.lastName).toBe(newUser.lastName);
      expect.soft(bcrypt.compareSync(newUser.password, signedUpUser.password)).toBe(true);
      expect.soft(signedUpUser.balance).toBe(0);
    });

    await test.step("Verify user is redirected to Sign In page", async () => {
      await expect.soft(signInPage.signInBtn).toBeVisible();
      expect.soft(signInPage.page.url()).toContain("/signin");
    });
  });
});

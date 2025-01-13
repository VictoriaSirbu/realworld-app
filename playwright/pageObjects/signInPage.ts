import { Locator, Page } from "playwright/test";
import { User } from "../constants/types";

export class SignInPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly signInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator("#username");
    this.passwordField = page.locator("#password");
    this.signInBtn = page.getByTestId("signin-submit");
  }

  async fillSignInForm(user: User) {
    await this.usernameField.fill(user.username!);
    await this.passwordField.fill(user.password);
  }

  async signIn(user: User) {
    await this.fillSignInForm(user);
    await this.signInBtn.click();
  }

  async goto() {
    await this.page.goto("/signin");
  }
}

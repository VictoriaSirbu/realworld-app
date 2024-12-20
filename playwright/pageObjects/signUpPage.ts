import { Locator, Page } from "playwright/test";
import { User } from "../constants/types";

export class SignUpPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly confirmPassword: Locator;
  readonly signUpBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.locator("#firstName");
    this.lastNameField = page.locator("#lastName");
    this.usernameField = page.locator("#username");
    this.passwordField = page.locator("#password");
    this.confirmPassword = page.locator("#confirmPassword");
    this.signUpBtn = page.getByTestId("signup-submit");
  }

  async fillSignUpForm(newUser: User) {
    await this.firstNameField.fill(newUser.firstName);
    await this.lastNameField.fill(newUser.lastName);
    await this.usernameField.fill(newUser.username);
    await this.passwordField.fill(newUser.password);
    await this.confirmPassword.fill(newUser.password);
  }

  async signUp(newUser: User) {
    await this.fillSignUpForm(newUser);
    await this.signUpBtn.click();
  }

  async goto() {
    await this.page.goto("/signup");
  }
}

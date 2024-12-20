import { Locator, Page } from "playwright/test";
import { User } from "../constants/types";

export class MyAccountPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly phoneNumberField: Locator;
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.locator("#user-settings-firstName-input");
    this.lastNameField = page.getByTestId("user-settings-lastName-input");
    this.emailField = page.getByTestId("user-settings-email-input");
    this.phoneNumberField = page.getByTestId("user-settings-phoneNumber-input");
    this.saveBtn = page.getByTestId("user-settings-submit");
  }

  async fillUserInfoForm(user: User) {
    await this.firstNameField.fill(user.firstName);
    await this.lastNameField.fill(user.lastName);
    await this.emailField.fill(user.email);
    await this.phoneNumberField.fill(user.phoneNumber);
  }

  async updateUserInfo(user: User) {
    await this.fillUserInfoForm(user);
    await this.saveBtn.click();
  }

  async goto() {
    await this.page.goto("/user/settings");
  }
}

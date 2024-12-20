import { Locator, Page } from "@playwright/test";

export class Menu {
  readonly page: Page;
  readonly homeBtn: Locator;
  readonly myAccountBtn: Locator;
  readonly bankAccountBtn: Locator;
  readonly notificationsBtn: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeBtn = page.getByTestId("sidenav-home");
    this.myAccountBtn = page.getByTestId("sidenav-user-settings");
    this.bankAccountBtn = page.getByTestId("sidenav-bankaccounts");
    this.notificationsBtn = page.getByTestId("sidenav-notifications");
    this.logoutBtn = page.getByTestId("sidenav-signout");
  }
}

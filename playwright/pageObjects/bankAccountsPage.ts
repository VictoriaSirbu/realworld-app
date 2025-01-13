import { Locator, Page } from "@playwright/test";

export class BankAccountsPage {
  readonly page: Page;
  readonly createBtn: Locator;
  readonly deleteBtn: Locator;
  readonly bankAccountsList: Locator;
  readonly bankAccount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createBtn = page.getByTestId("bankaccount-new");
    this.deleteBtn = page.getByTestId("bankaccount-delete");
    this.bankAccountsList = page.getByTestId("bankaccount-list");
    this.bankAccount = this.bankAccountsList.locator("li");
  }
}

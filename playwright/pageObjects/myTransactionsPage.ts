import { Locator, Page } from "@playwright/test";

export class MyTransactionsPage {
  readonly page: Page;

  readonly transactionsList: Locator;

  readonly transaction: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transactionsList = page.getByTestId("transaction-list");
    this.transaction = this.transactionsList.locator("li");
  }
}

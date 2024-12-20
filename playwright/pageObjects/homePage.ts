import { Locator, Page } from "@playwright/test";
import { Menu } from "./menuComponent";

export class HomePage {
  readonly page: Page;
  readonly fullName: Locator;
  readonly username: Locator;
  readonly amountBalance: Locator;
  readonly menu: Menu;
  readonly transactionList: Locator;
  readonly newTransactionBtn: Locator;
  readonly myTransactionBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullName = page.getByTestId("sidenav-user-full-name");
    this.username = page.getByTestId("sidenav-username");
    this.amountBalance = page.getByTestId("sidenav-user-balance");
    this.menu = new Menu(page);
    this.transactionList = page.getByTestId("transaction-list");
    this.newTransactionBtn = page.getByTestId("nav-top-new-transaction");
    this.myTransactionBtn = page.getByTestId("nav-personal-tab");
  }
  async goto() {
    await this.page.goto("http://localhost:3000/ ");
  }
}

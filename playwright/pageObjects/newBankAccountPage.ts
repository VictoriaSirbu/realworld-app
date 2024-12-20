import { Locator, Page } from "@playwright/test";
import { BankAccount } from "../constants/types";

export class NewBankAccountPage {
  readonly page: Page;
  readonly bankNameInputField: Locator;
  readonly accountNumberInputField: Locator;
  readonly routingNumberInputField: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bankNameInputField = page.locator("#bankaccount-bankName-input");
    this.accountNumberInputField = page.locator("#bankaccount-accountNumber-input");
    this.routingNumberInputField = page.locator("#bankaccount-routingNumber-input");
    this.saveButton = page.getByTestId("bankaccount-submit");
  }

  async fillNewBankAccountForm(bankAccount: BankAccount) {
    await this.bankNameInputField.fill(bankAccount.bankName);
    await this.accountNumberInputField.fill(bankAccount.accountNumber);
    await this.routingNumberInputField.fill(bankAccount.routingNumber);
  }

  async createBankAccount(bankAccount: BankAccount) {
    await this.fillNewBankAccountForm(bankAccount);
    await this.saveButton.click();
  }
}

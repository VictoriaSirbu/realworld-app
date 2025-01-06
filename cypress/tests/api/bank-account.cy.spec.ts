import { BankAccount } from "../../support/constants/types";
import { generateRandomBankAccount } from "../../support/utils/user-utils";

let newBankAccount: BankAccount;
let createdBankAccount: BankAccount;

describe("Bank Account API tests @api", function () {
  before("Create a bank account", function () {
    newBankAccount = generateRandomBankAccount();

    cy.log("Create a new bank account");
    cy.createBankAccountByGraphQL(newBankAccount).then((bankAccount: BankAccount) => {
      createdBankAccount = bankAccount;
      cy.log(`Created bank account: ${JSON.stringify(createdBankAccount)}`);
    });
  });

  beforeEach("Sign In", function () {
    cy.log("Sign in with existing account");
    cy.signInByApi(Cypress.env("signedUpUser"));
  });

  it("Should get a list of bank accounts for user", function () {
    cy.getBankAccountsByApi().then((bankAccounts) => {
      expect(bankAccounts).to.be.an("array");
      expect(bankAccounts).to.have.length.greaterThan(1);

      const createdBankAccount = bankAccounts[bankAccounts.length - 1];
      expect(createdBankAccount.bankName).to.equal(newBankAccount.bankName);
      expect(createdBankAccount.accountNumber).to.equal(newBankAccount.accountNumber);
      expect(createdBankAccount.routingNumber).to.equal(newBankAccount.routingNumber);
    });
  });

  it("Should delete a bank account", function () {
    cy.deleteBankAccountByApi(createdBankAccount.id!);

    cy.getBankAccountByApi(createdBankAccount.id!).then((bankAccount) => {
      expect(bankAccount.isDeleted).to.equal(true);
    });
  });
});

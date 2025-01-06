import { BankAccount, User } from "../../support/constants/types";
import { generateRandomBankAccount } from "../../support/utils/user-utils";

let user: User;
let newBankAccount: BankAccount;

describe("Bank Account tests @ui", () => {
  beforeEach(() => {
    user = Cypress.env("signedUpUser");

    cy.log("Go to Sign in page");
    cy.visit("/signin");

    cy.log("Sign in with existing account");
    cy.signIn(user);

    cy.log("Go to Bank Accounts page");
    cy.getBySel("sidenav-bankaccounts").click();
  });

  it("Should add new bank account", function () {
    newBankAccount = generateRandomBankAccount();

    cy.log("Create a new bank account");
    cy.getBySel("bankaccount-new").click();
    cy.createBankAccount(newBankAccount);

    cy.log("Verify Bank Accounts page contains the created bank account");
    cy.getBySel("bankaccount-list")
      .get("li")
      .last()
      .should("have.text", `${newBankAccount.bankName} Delete`);
  });

  it("Should delete bank account", function () {
    cy.log("Delete bank account");
    cy.getBySel("bankaccount-delete").last().click();

    cy.log("Verify bank account is deleted on Bank Accounts page");
    cy.getBySel("bankaccount-list").get("li").last().should("contain.text", "(Deleted)");
  });
});

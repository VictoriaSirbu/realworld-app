import "@cypress/code-coverage/support";
import "./commands";
import { generateRandomBankAccount, generateRandomUser } from "./utils/user-utils";

before("Global Setup", function () {
  cy.log("Set up global variables");
  const user = generateRandomUser();
  const bankAccount = generateRandomBankAccount();

  cy.log("Sign up new user");
  cy.signUpByApi(user);
  Cypress.env("signedUpUser", user);
  cy.log(`Signed up user: ${JSON.stringify(user)}`);

  cy.log("Sign in with new user");
  cy.signInByApi(user).then((response) => {
    Cypress.env("cookies", response.headers["set-cookie"]);
  });

  cy.log("Create a new bank account");
  cy.createBankAccountByGraphQL(bankAccount);
  Cypress.env("bankAccount", bankAccount);
  cy.log(`Created bank account: ${JSON.stringify(bankAccount)}`);

  cy.log("Get all existing users and save to fixture file");
  cy.getUsersByApi().then((users) => {
    cy.task("writeFile", { filename: "users.json", content: users });
  });
});

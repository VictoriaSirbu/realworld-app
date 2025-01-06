// @ts-check
///<reference path="../global.d.ts" />

// Import Cypress Percy plugin command (https://docs.percy.io/docs/cypress)
import "@percy/cypress";
import { BankAccount, Transaction, User } from "./constants/types";
import graphqlPayload from "../support/constants/graphql-payloads.json";

Cypress.Commands.add("visualSnapshot", (maybeName) => {
  // @ts-ignore
  let snapshotTitle = cy.state("runnable").fullTitle();
  if (maybeName) {
    snapshotTitle = snapshotTitle + " - " + maybeName;
  }
  cy.percySnapshot(snapshotTitle, {
    // @ts-ignore
    widths: [cy.state("viewportWidth")],
    // @ts-ignore
    minHeight: cy.state("viewportHeight"),
  });
});

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add("fillSignUpForm", (newUser: User) => {
  cy.log("Filling sign up form");
  cy.get("#firstName").type(newUser.firstName);
  cy.get("#lastName").type(newUser.lastName);
  cy.get("#username").type(newUser.username);
  cy.get("#password").type(newUser.password);
  cy.get("#confirmPassword").type(newUser.password);
});

Cypress.Commands.add("signUp", (newUser: User) => {
  cy.fillSignUpForm(newUser);
  cy.log("Submitting sign up form");
  cy.getBySel("signup-submit").click();
});

Cypress.Commands.add("fillSignInForm", (user: User) => {
  cy.log("Filling sign in form");
  cy.get("#username").type(user.username);
  cy.get("#password").type(user.password);
});

Cypress.Commands.add("signIn", (user: User, { rememberUser = false } = {}) => {
  const signinPath = "/signin";
  const log = Cypress.log({
    name: "login",
    displayName: "LOGIN",
    message: [`Authenticating | ${user.username}`],
    autoEnd: false,
  });

  cy.intercept("POST", "/login").as("loginUser");
  cy.intercept("GET", "checkAuth").as("getUserProfile");

  cy.location("pathname", { log: false }).then((currentPath) => {
    if (currentPath !== signinPath) {
      cy.visit(signinPath);
    }
  });

  log.snapshot("before");

  cy.fillSignInForm(user);

  if (rememberUser) {
    cy.getBySel("signin-remember-me").find("input").check();
  }

  cy.log("Submitting sign in form");
  cy.getBySel("signin-submit").click();
  cy.wait("@loginUser").then((loginUser: any) => {
    log.set({
      consoleProps() {
        return {
          username: user.username,
          password: user.password,
          rememberUser,
          userId: loginUser.response.statusCode !== 401 && loginUser.response.body.user.id,
        };
      },
    });

    log.snapshot("after");
    log.end();
  });
});

Cypress.Commands.add("fillUserDetailsForm", (user: User) => {
  cy.log("Filling user details form");
  cy.get("#user-settings-firstName-input").clear().type(user.firstName);
  cy.get("#user-settings-lastName-input").clear().type(user.lastName);
  cy.get("#user-settings-email-input").type(user.email);
  cy.get("#user-settings-phoneNumber-input").type(user.phoneNumber);
});

Cypress.Commands.add("updateUserDetails", (user: User) => {
  cy.fillUserDetailsForm(user);
  cy.log("Submitting user details form");
  cy.getBySel("user-settings-submit").click();
});

Cypress.Commands.add("fillNewBankAccountForm", (bankAccount: BankAccount) => {
  cy.log("Filling new bank account form");
  cy.get("#bankaccount-bankName-input").clear().type(bankAccount.bankName);
  cy.get("#bankaccount-accountNumber-input").clear().type(bankAccount.accountNumber);
  cy.get("#bankaccount-routingNumber-input").type(bankAccount.routingNumber);
});

Cypress.Commands.add("createBankAccount", (bankAccount: BankAccount) => {
  cy.fillNewBankAccountForm(bankAccount);
  cy.log("Submitting new bank account form");
  cy.getBySel("bankaccount-submit").click();
});

Cypress.Commands.add("signUpByApi", (newUser: User) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/users`,
    body: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      password: newUser.password,
      confirmPassword: newUser.password,
    },
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body.user as User;
  });
});

Cypress.Commands.add("signInByApi", (user: User) => {
  return cy.request("POST", `${Cypress.env("apiUrl")}/login`, {
    username: user.username,
    password: user.password,
  });
});

Cypress.Commands.add("getCurrentUserByApi", () => {
  cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/checkAuth`,
    headers: Cypress.env("cookies"),
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.user as User;
  });
});

Cypress.Commands.add("getUsersByApi", () => {
  cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/users`,
    headers: Cypress.env("cookies"),
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.results).to.be.an("array");
    expect(response.body.results[0]).to.be.an("object");
    return response.body.results as User[];
  });
});

Cypress.Commands.add("getUserProfileByApi", (username: string) => {
  return cy
    .request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/users/profile/${username}`,
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      return response.body.user as User;
    });
});

Cypress.Commands.add("createBankAccountByGraphQL", (bankAccount: BankAccount) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/graphql`,
    body: {
      ...graphqlPayload.CreateBankAccount,
      variables: {
        userId: bankAccount.userId,
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        routingNumber: bankAccount.routingNumber,
      },
    },
    headers: Cypress.env("cookies"),
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.data.createBankAccount as BankAccount;
  });
});

Cypress.Commands.add("getBankAccountsByApi", () => {
  cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/bankAccounts`,
    headers: Cypress.env("cookies"),
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.results as BankAccount[];
  });
});

Cypress.Commands.add("getBankAccountByApi", (bankAccountId: string) => {
  cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/bankAccounts/${bankAccountId}`,
    headers: Cypress.env("cookies"),
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.account as BankAccount;
  });
});

Cypress.Commands.add("deleteBankAccountByApi", (bankAccountId: string) => {
  cy.request({
    method: "DELETE",
    url: `${Cypress.env("apiUrl")}/bankAccounts/${bankAccountId}`,
    headers: Cypress.env("cookies"),
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.account as BankAccount;
  });
});

Cypress.Commands.add("createTransactionByApi", (transaction: Transaction) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/transactions`,
    headers: Cypress.env("cookies"),
    body: transaction,
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.transaction as Transaction;
  });
});

Cypress.Commands.add("createTransactionCommentByApi", (transactionId: string, comment: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/comments/${transactionId}`,
    headers: Cypress.env("cookies"),
    body: {
      content: comment,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.transaction as Transaction;
  });
});

Cypress.Commands.add("getTransactionByApi", (transactionId: string) => {
  cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/transactions/${transactionId}`,
    headers: Cypress.env("cookies"),
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.transaction as Transaction;
  });
});

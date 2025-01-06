import faker from "@faker-js/faker";
import { Transaction, User } from "../../support/constants/types";
import { generateRandomTransaction } from "../../support/utils/user-utils";

let transaction: Transaction;
let receiver: User;

describe("Transaction API tests @api", function () {
  before(() => {
    cy.log("Get a random user from users.json fixture to use as a receiver");
    cy.fixture("users.json").then((users) => {
      receiver = faker.random.arrayElement(users);
      cy.log(`Receiver: ${JSON.stringify(receiver)}`);
    });
  });

  beforeEach("Create a transaction", function () {
    cy.log("Sign in with existing account");
    cy.signInByApi(Cypress.env("signedUpUser"));

    cy.log("Create a new transaction");
    let newTransaction: Transaction = generateRandomTransaction(receiver.id!);
    cy.createTransactionByApi(newTransaction).then((createdTransaction) => {
      transaction = createdTransaction;
      cy.log(`Created transaction: ${JSON.stringify(transaction)}`);
    });
  });

  it("Should create a new comment for a transaction", function () {
    cy.log("Create a new comment for the transaction");
    const comment = faker.lorem.sentence();
    cy.createTransactionCommentByApi(transaction.id!, comment);
    cy.log(`Comment: ${comment}`);

    cy.getTransactionByApi(transaction.id!).then((updatedTransaction) => {
      expect(updatedTransaction.comments!).to.have.length(1);
      expect(updatedTransaction.comments![0].content).to.equal(comment);
    });
  });
});

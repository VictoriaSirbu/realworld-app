import { faker } from "@faker-js/faker";
import { Transaction, User } from "../../support/constants/types";
import { generateRandomTransaction } from "../../support/utils/user-utils";

describe("My Transactions tests @ui", () => {
  let user: User;
  let users: User[];
  let receiver: User;
  let transaction: Transaction;

  before(() => {
    cy.log("Get users from users.json fixture");
    cy.fixture("users.json").then((usersData) => {
      users = usersData;
    });
  });

  beforeEach(function () {
    user = Cypress.env("signedUpUser");
    receiver = faker.random.arrayElement(users);

    cy.log("Go to Sign in page");
    cy.visit("/signin");

    cy.log("Sign in with existing account");
    cy.signIn(user);

    cy.log("Create transaction");
    transaction = generateRandomTransaction(receiver.id!);
    cy.createTransactionByApi(transaction);

    cy.log("Go to My transactions page");
    cy.getBySel("nav-personal-tab").click();
  });

  it("Should see account transactions history", () => {
    cy.getBySel("transaction-list").should("be.visible");
    cy.getBySel("transaction-list").get("li").should("have.length", 1);
  });

  it("Should see account transaction details", function () {
    cy.getBySel("transaction-list").get("li").first().click();
    cy.getBySelLike("transaction-sender").should("have.text", `${user.firstName} ${user.lastName}`);

    const action = transaction.transactionType === "payment" ? " paid " : " requested ";
    cy.getBySelLike("transaction-action").should("have.text", action);
    cy.getBySelLike("transaction-receiver").should(
      "have.text",
      `${receiver.firstName} ${receiver.lastName}`
    );

    const amount = transaction.amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedAmount =
      transaction.transactionType === "payment" ? `-$${amount}` : `+$${amount}`;

    cy.getBySelLike("transaction-amount").should("have.text", formattedAmount);
    cy.getBySel("transaction-description").should("have.text", transaction.description);
    cy.getBySelLike("transaction-like-count").should("have.text", "0 ");
    cy.getBySel("comments-list").should("not.exist");
  });
});

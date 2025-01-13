import { User } from "../../support/constants/types";

describe("Home page tests @ui", () => {
  let user: User;

  beforeEach(() => {
    user = Cypress.env("signedUpUser");

    cy.log("Go to Sign in page");
    cy.visit("/signin");

    cy.log("Sign in with existing account");
    cy.signIn(user);
  });

  it("Should see account details", function () {
    cy.getBySel("sidenav-user-full-name").should(
      "have.text",
      `${user.firstName} ${user.lastName.charAt(0)}`
    );
    cy.getBySel("sidenav-username").should("have.text", `@${user.username}`);
  });

  it("Should see account balance", function () {
    cy.getBySel("sidenav-user-balance").should("have.text", "$0.00");
  });
});

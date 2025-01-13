import { User } from "../../support/constants/types";

describe("User signing in tests @ui", () => {
  let user: User;

  beforeEach(() => {
    user = Cypress.env("signedUpUser");

    cy.log("Go to Sign In page");
    cy.visit("/signin");
  });

  it("Should log in with existing account", function () {
    cy.log("Sign in with existing account");
    cy.signIn(user);
    cy.url().should("contain", "/");
    cy.getBySel("sidenav-username").should("have.text", `@${user.username}`);
  });
});

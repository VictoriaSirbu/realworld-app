import { User } from "../../support/constants/types";
import { generateRandomUser } from "../../support/utils/user-utils";

describe("Account registration tests @ui", () => {
  let newUser: User;

  beforeEach(() => {
    newUser = generateRandomUser();
    cy.log("Go to Sign Up page");
    cy.visit("/signup");
  });

  it("Should register a new account", () => {
    cy.signUp(newUser);

    cy.log("Verify user is redirected to Sign In page");
    cy.contains("Sign in").should("be.visible");
    cy.url().should("contain", "/signin");
  });
});

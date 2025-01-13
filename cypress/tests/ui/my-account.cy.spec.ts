import { User } from "../../support/constants/types";
import { generateRandomBankAccount, generateRandomUser } from "../../support/utils/user-utils";

describe("My account tests @ui", () => {
  let user: User;
  let updatedUser: User;

  beforeEach(() => {
    user = generateRandomUser();
    updatedUser = { ...generateRandomUser(), username: user.username, password: user.password };

    cy.log("Sign up new user");
    cy.signUpByApi(user);

    cy.log("Sign in with existing account");
    cy.signIn(user);

    cy.log("Create bank account");
    cy.createBankAccountByGraphQL(generateRandomBankAccount());

    cy.log("Go to Home page");
    cy.visit("/");
  });

  it("Should update account user settings", function () {
    cy.log("Go to my account page");
    cy.getBySel("sidenav-user-settings").click();
    cy.url().should("contain", "/user/settings");

    cy.log("Update user details");
    cy.updateUserDetails(updatedUser);

    cy.log("Verify user is updated");
    cy.visit("/");
    cy.getBySel("sidenav-user-full-name").should(
      "have.text",
      `${updatedUser.firstName} ${updatedUser.lastName.charAt(0)}`
    );
    cy.getBySel("sidenav-username").should("have.text", `@${user.username}`);

    cy.getCurrentUserByApi().then((response) => {
      expect(response.firstName).to.equal(updatedUser.firstName);
      expect(response.lastName).to.equal(updatedUser.lastName);
      expect(response.username).to.equal(updatedUser.username);
      expect(response.email).to.equal(updatedUser.email);
      expect(response.phoneNumber).to.equal(updatedUser.phoneNumber);
    });
  });
});

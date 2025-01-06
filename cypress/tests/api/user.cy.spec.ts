import faker from "@faker-js/faker";
import { User } from "../../support/constants/types";

let randomUser: User;

describe("User API tests @api", function () {
  before(() => {
    cy.log("Get a random user from users.json");
    cy.fixture("users.json").then((users) => {
      randomUser = faker.random.arrayElement(users);
      cy.log(`Random user: ${JSON.stringify(randomUser)}`);
    });
  });

  beforeEach(() => {
    cy.log("Sign in with existing account");
    cy.signInByApi(Cypress.env("signedUpUser"));
  });

  it("Should get a user profile by username", function () {
    cy.getUserProfileByApi(randomUser.username).then((profile) => {
      expect(profile).to.be.an("object");
      expect(profile).to.have.property("firstName").that.eq(randomUser.firstName);
      expect(profile).to.have.property("lastName").that.eq(randomUser.lastName);
    });
  });

  it("Should get list of users", () => {
    cy.getUsersByApi().then((users) => {
      expect(users.length).to.be.greaterThan(1);
      expect(users[0]).to.have.property("id").that.is.a("string");
      expect(users[0]).to.have.property("username").that.is.a("string");
    });
  });
});

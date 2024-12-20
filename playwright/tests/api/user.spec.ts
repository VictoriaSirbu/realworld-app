import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import { TestContext } from "../../context/testContext";
import { createUser, getUserProfile, getUsers } from "../../utils/apiUtils";
import { User } from "../../constants/types";
import faker from "@faker-js/faker";
import { generateRandomUser } from "../../utils/userUtils";

const user: User = faker.random.arrayElement(JSON.parse(TestContext.USERS));

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("User API tests @api", () => {
  test("Create a user", async ({ request, apiURL }) => {
    const newUser = generateRandomUser();
    const createdUser = await createUser(request, apiURL, newUser);

    const userAccounts = await getUsers(request, apiURL);
    const userAccountsCount = userAccounts.length;
    expect(userAccountsCount).toBeGreaterThan(0);
    expect(userAccounts[userAccountsCount - 1]).toMatchObject(createdUser);
  });

  test("Should get a user profile by username", async ({ request, apiURL }) => {
    const userProfile = await getUserProfile(request, apiURL, user.username);
    expect(userProfile.firstName).toBe(user.firstName);
    expect(userProfile.lastName).toBe(user.lastName);
  });

  test("Should get list of all users", async ({ request, apiURL }) => {
    const users = await getUsers(request, apiURL);
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);

    await Promise.all(
      users.map(async (user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("firstName");
        expect(user).toHaveProperty("createdAt");
        expect(user).toHaveProperty("username");
      })
    );
  });
});

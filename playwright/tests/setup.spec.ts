import { expect } from "@playwright/test";
import { test } from "../config/customTestOptions";
import { generateRandomBankAccount, generateRandomUser } from "../utils/userUtils";
import bcrypt from "bcryptjs";
import { createBankAccountByGraphQl } from "../utils/graphqlUtils";
import { TestContext } from "../context/testContext";
import { createUser, getUsers, loginByAPI } from "../utils/apiUtils";
import { User } from "../constants/types";

const user = generateRandomUser();

let signedUpUser: User;

test("Setup", async ({ request, apiURL }) => {
  await test.step("Sign up", async () => {
    signedUpUser = await createUser(request, apiURL, user);
    expect(signedUpUser).toBeDefined();
    expect(signedUpUser).not.toBeNull();
    expect(signedUpUser.firstName).toBe(user.firstName);
    expect(signedUpUser.lastName).toBe(user.lastName);
    expect(bcrypt.compareSync(user.password, signedUpUser.password)).toBe(true);
    expect(signedUpUser.balance).toBe(0);

    process.env.REGISTERED_USER = JSON.stringify(user);
    console.log("Signed up user", user);
  });

  await test.step("Log in", async () => {
    const response = await loginByAPI(request, apiURL, user);
    expect(response.status()).toBe(200);
  });

  await test.step("Create bank account", async () => {
    const createdBankAccount = await createBankAccountByGraphQl(
      request,
      apiURL,
      generateRandomBankAccount()
    );
    expect(createdBankAccount).toBeDefined();

    process.env.REGISTERED_BANK_ACCOUNT = JSON.stringify(createdBankAccount);
  });

  await test.step("Get list of users", async () => {
    const users = await getUsers(request, apiURL);
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);

    process.env.USERS = JSON.stringify(users);
  });

  await test.step("Save request context", async () => {
    await request.storageState({ path: TestContext.STORAGE_STATE_COOKIES });
  });
});

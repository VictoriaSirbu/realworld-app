import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import { createBankAccountByGraphQl } from "../../utils/graphqlUtils";
import { generateRandomBankAccount } from "../../utils/userUtils";
import { TestContext } from "../../context/testContext";
import { BankAccount } from "../../constants/types";
import { deleteBankAccount, getBankAccount, getBankAccounts } from "../../utils/apiUtils";

let newBankAccount: BankAccount;
let createdBankAccount: BankAccount;

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("Bank Account API tests @api", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach("Create a bank account", async ({ request, apiURL }) => {
    newBankAccount = generateRandomBankAccount();
    createdBankAccount = await createBankAccountByGraphQl(request, apiURL, newBankAccount);
    createdBankAccount.createdAt = new Date(parseInt(createdBankAccount.createdAt!)).toISOString();
  });

  test("Get a list of bank accounts for user", async ({ request, apiURL }) => {
    const bankAccounts = await getBankAccounts(request, apiURL);
    expect(bankAccounts).toBeDefined();
    expect(bankAccounts).not.toBeNull();

    const bankAccountsCount = bankAccounts.length;
    expect(bankAccountsCount).toBeGreaterThan(1);
    expect(bankAccounts[bankAccountsCount - 1]).toMatchObject(createdBankAccount);

    await Promise.all(
      bankAccounts.map(async (bankAccount) => {
        expect(bankAccount).toHaveProperty("id");
        expect(bankAccount).toHaveProperty("userId");
        expect(bankAccount).toHaveProperty("accountNumber");
        expect(bankAccount).toHaveProperty("routingNumber");
      })
    );
  });

  test("Should delete a bank account", async ({ request, apiURL }) => {
    const response = await deleteBankAccount(request, apiURL, createdBankAccount.id!);
    expect(response.status()).toBe(200);

    const deletedBankAccount = await getBankAccount(request, apiURL, createdBankAccount.id!);
    expect(deletedBankAccount.isDeleted).toBe(true);
  });
});

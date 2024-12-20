import { expect } from "@playwright/test";
import { test } from "../config/customTestOptions";
import { BankAccount } from "../constants/types";
import { TestContext } from "../context/testContext";
import { deleteBankAccount, getBankAccount } from "../utils/apiUtils";

const bankAccount: BankAccount = JSON.parse(TestContext.REGISTERED_BANK_ACCOUNT);

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test("Teardown", async ({ request, apiURL }) => {
  await test.step("Delete bank account", async () => {
    const response = await deleteBankAccount(request, apiURL, bankAccount.id!);
    expect(response.status()).toBe(200);
    expect(await response.json()).toStrictEqual({});
  });

  await test.step("Verify bank account is deleted", async () => {
    const deletedBankAccount = await getBankAccount(request, apiURL, bankAccount.id!);
    expect(deletedBankAccount.isDeleted).toBe(true);
  });
});

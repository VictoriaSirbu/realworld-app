import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import { createTransaction, getTransaction, createTransactionComment } from "../../utils/apiUtils";
import { generateRandomTransaction } from "../../utils/userUtils";
import { TestContext } from "../../context/testContext";
import { Transaction, User } from "../../constants/types";
import faker from "@faker-js/faker";

const user: User = faker.random.arrayElement(JSON.parse(TestContext.USERS));

let newTransaction: Transaction;
let createdTransaction: Transaction;

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("Transaction API tests @api", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach("Create a transaction", async ({ request, apiURL }) => {
    newTransaction = generateRandomTransaction(user.id!);
    createdTransaction = await createTransaction(request, apiURL, newTransaction);
  });

  test("Get transaction by id", async ({ request, apiURL }) => {
    const transaction = await getTransaction(request, apiURL, createdTransaction.id!);
    expect(transaction.id).toBe(createdTransaction.id);
    expect(transaction.receiverId).toBe(createdTransaction.receiverId);
    expect(transaction.senderId).toBe(createdTransaction.senderId);
    expect(transaction.amount).toBe(createdTransaction.amount);
    expect(transaction.description).toBe(createdTransaction.description);
  });

  test("Create comment on transaction", async ({ request, apiURL }) => {
    let comment = faker.lorem.text();
    const commentedTransaction = await createTransactionComment(
      request,
      apiURL,
      createdTransaction.id!,
      comment
    );
    expect(commentedTransaction.status()).toBe(200);
    const updatedTransaction = await getTransaction(request, apiURL, createdTransaction.id!);
    expect(updatedTransaction.comments!.length).toBe(1);
    expect(updatedTransaction.comments![0].content).toBe(comment);
  });
});

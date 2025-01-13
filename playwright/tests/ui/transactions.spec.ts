import { expect } from "@playwright/test";
import { test } from "../../config/customTestOptions";
import { SignInPage } from "../../pageObjects/signInPage";
import { HomePage } from "../../pageObjects/homePage";
import { MyTransactionsPage } from "../../pageObjects/myTransactionsPage";
import { TransactionDetailPage } from "../../pageObjects/transactionDetailPage";
import { TestContext } from "../../context/testContext";
import { createTransaction, getTransactions } from "../../utils/apiUtils";
import { generateRandomTransaction } from "../../utils/userUtils";
import { Transaction, User } from "../../constants/types";
import faker from "@faker-js/faker";

const user: User = JSON.parse(TestContext.REGISTERED_USER);

let newTransaction: Transaction;
let createdTransaction: Transaction;

let signInPage: SignInPage;
let homePage: HomePage;
let myTransactionsPage: MyTransactionsPage;
let transactionDetailPage: TransactionDetailPage;
let receiver: User;

test.use({ storageState: TestContext.STORAGE_STATE_COOKIES });

test.describe("User Transactions Tests @ui", () => {
  test.beforeEach(
    "Create a transaction and go to My transactions page",
    async ({ page, apiURL }) => {
      signInPage = new SignInPage(page);
      homePage = new HomePage(page);
      myTransactionsPage = new MyTransactionsPage(page);
      receiver = faker.random.arrayElement(JSON.parse(TestContext.USERS));

      newTransaction = generateRandomTransaction(receiver.id!);
      console.log("newTransaction", newTransaction);

      await signInPage.goto();
      await signInPage.signIn(user);

      createdTransaction = await createTransaction(page.request, apiURL, newTransaction);
      expect(createdTransaction).toBeDefined();

      await homePage.myTransactionBtn.click();
    }
  );

  test("Should see account transactions history", async ({ request, apiURL }) => {
    const userTransactions = await getTransactions(request, apiURL);
    await expect.soft(myTransactionsPage.transactionsList).toBeVisible();
    await expect.soft(myTransactionsPage.transaction).toHaveCount(userTransactions.length);
  });

  test("Should see account transaction details", async () => {
    const transactionId = createdTransaction.id;
    await myTransactionsPage.transaction.first().click();
    expect.soft(myTransactionsPage.page.url()).toContain(`/transaction/${transactionId}`);
    transactionDetailPage = new TransactionDetailPage(myTransactionsPage.page, transactionId!);

    await expect
      .soft(transactionDetailPage.sender)
      .toHaveText(`${user.firstName} ${user.lastName}`);

    const action = newTransaction.transactionType === "payment" ? "paid" : "requested";

    await expect.soft(transactionDetailPage.action).toHaveText(action);

    await expect
      .soft(transactionDetailPage.receiver)
      .toHaveText(`${receiver.firstName} ${receiver.lastName}`);

    const amount = newTransaction.amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedAmount =
      newTransaction.transactionType === "payment" ? `-$${amount}` : `+$${amount}`;
    await expect.soft(transactionDetailPage.amount).toHaveText(formattedAmount);
    await expect.soft(transactionDetailPage.description).toHaveText(newTransaction.description);

    await expect.soft(transactionDetailPage.likesCount).toHaveText("0");
    await expect.soft(transactionDetailPage.commentsList).not.toBeAttached();
  });
});

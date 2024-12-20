import { Locator, Page } from "playwright/test";

export class TransactionDetailPage {
  readonly page: Page;

  readonly transactionId: string;

  readonly title: Locator;

  readonly item: Locator;

  readonly sender: Locator;

  readonly action: Locator;

  readonly receiver: Locator;

  readonly amount: Locator;

  readonly description: Locator;

  readonly likesCount: Locator;

  readonly likeButton: Locator;

  readonly commentInputField: Locator;

  readonly commentsList: Locator;

  constructor(page: Page, transactionId: string) {
    this.page = page;
    this.transactionId = transactionId;
    this.title = page.getByTestId("transaction-detail-header");
    this.item = page.getByTestId(`transaction-item-${transactionId}`);
    this.sender = page.getByTestId(`transaction-sender-${transactionId}`);
    this.action = page.getByTestId(`transaction-action-${transactionId}`);
    this.receiver = page.getByTestId(`transaction-receiver-${transactionId}`);
    this.amount = page.getByTestId(`transaction-amount-${transactionId}`);
    this.description = page.getByTestId("transaction-description");
    this.likesCount = page.getByTestId(`transaction-like-count-${transactionId}`);
    this.likeButton = page.getByTestId("transaction-like-button");
    this.commentInputField = page.getByTestId("transaction-comment-input");
    this.commentsList = page.getByTestId("comments-list");
  }
}

/// <reference types="cypress" />

declare namespace Cypress {
  type LoginOptions = {
    rememberUser: boolean;
  };

  interface Chainable {
    /**
     * Custom command to make taking Percy snapshots with full name formed from the test title + suffix easier
     */
    visualSnapshot(maybeName?): Chainable<any>;

    getBySel(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;
    getBySelLike(dataTestPrefixAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;

    fillSignUpForm(newUser: User): void;

    signUp(newUser: User): void;

    fillSignInForm(newUser: User): void;

    signIn(newUser: User, loginOptions?: LoginOptions): void;

    fillUserDetailsForm(user: User): void;

    updateUserDetails(newUser: User): void;

    fillNewBankAccountForm(bankAccount: BankAccount): void;

    createBankAccount(bankAccount: BankAccount): void;

    signUpByApi(newUser: User): Chainable<User>;

    signInByApi(user: User): Chainable<User>;

    getCurrentUserByApi(): Chainable<User>;

    getUsersByApi(): Chainable<User[]>;

    getUserProfileByApi(username: string): Chainable<User>;

    getBankAccountsByApi(): Chainable<BankAccount[]>;

    getBankAccountByApi(bankAccountId: string): Chainable<BankAccount>;

    createBankAccountByGraphQL(bankAccount: BankAccount): Chainable<BankAccount>;

    deleteBankAccountByApi(bankAccountId: string): Chainable<BankAccount>;

    createTransactionByApi(transaction: Transaction): Chainable<Transaction>;

    createTransactionCommentByApi(transactionId: string, comment: string): Chainable<Transaction>;

    getTransactionByApi(transactionId: string): Chainable<Transaction>;
  }
}

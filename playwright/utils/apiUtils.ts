import { APIRequestContext, APIResponse } from "playwright/test";
import { getCookieHeaders } from "./cookieUtils";
import { BankAccount, Transaction, User } from "../constants/types";

export async function getUsers(context: APIRequestContext, apiURL: string): Promise<User[]> {
  const response = await context.get(`${apiURL}/users`, {
    headers: await getCookieHeaders(context),
  });
  return (await response.json()).results;
}

export async function getUserProfile(
  context: APIRequestContext,
  apiURL: string,
  username: string
): Promise<User> {
  const response = await context.get(`${apiURL}/users/profile/${username}`);
  return (await response.json()).user;
}

export async function getCurrentUser(context: APIRequestContext, apiURL: string): Promise<User> {
  const response = await context.get(`${apiURL}/checkAuth`);
  return (await response.json()).user;
}

export async function createUser(
  context: APIRequestContext,
  apiURL: string,
  user: User
): Promise<User> {
  const response = await context.post(`${apiURL}/users`, {
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
      confirmPassword: user.password,
    },
  });
  return (await response.json()).user;
}

export async function loginByAPI(
  context: APIRequestContext,
  apiURL: string,
  user: User
): Promise<APIResponse> {
  return await context.post(`${apiURL}/login`, {
    data: {
      username: user.username,
      password: user.password,
      type: "LOGIN",
    },
  });
}

export async function getBankAccounts(
  context: APIRequestContext,
  apiURL: string
): Promise<BankAccount[]> {
  const response = await context.get(`${apiURL}/bankAccounts`);
  return (await response.json()).results;
}

export async function getBankAccount(
  context: APIRequestContext,
  apiURL: string,
  bankAccountId: string
): Promise<BankAccount> {
  const response = await context.get(`${apiURL}/bankAccounts/${bankAccountId}`);
  return (await response.json()).account;
}

export async function deleteBankAccount(
  context: APIRequestContext,
  apiURL: string,
  bankAccountId: string
): Promise<APIResponse> {
  return await context.delete(`${apiURL}/bankAccounts/${bankAccountId}`);
}

export async function getTransactions(
  context: APIRequestContext,
  apiURL: string
): Promise<Transaction[]> {
  const response = await context.get(`${apiURL}/transactions`, {
    headers: await getCookieHeaders(context),
  });
  return (await response.json()).results;
}

export async function getTransaction(
  context: APIRequestContext,
  apiURL: string,
  transactionId: string
): Promise<Transaction> {
  const response = await context.get(`${apiURL}/transactions/${transactionId}`, {
    headers: await getCookieHeaders(context),
  });
  return (await response.json()).transaction;
}

export async function createTransaction(
  context: APIRequestContext,
  apiURL: string,
  transaction: Transaction
): Promise<Transaction> {
  const response = await context.post(`${apiURL}/transactions`, {
    data: transaction,
    headers: await getCookieHeaders(context),
  });
  return (await response.json()).transaction;
}

export async function createTransactionComment(
  context: APIRequestContext,
  apiURL: string,
  transactionId: string,
  comment: string
): Promise<APIResponse> {
  return await context.post(`${apiURL}/comments/${transactionId}`, {
    data: {
      content: comment,
    },
    headers: await getCookieHeaders(context),
  });
}

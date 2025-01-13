import faker from "@faker-js/faker";
import { BankAccount, Transaction, User } from "../constants/types";

export function generateRandomUser(): User {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber("#########"),
    avatar: faker.image.avatar(),
    defaultPrivacyLevel: "public",
    balance: 0,
  };
}

export function generateRandomBankAccount(): BankAccount {
  return {
    userId: faker.datatype.uuid(),
    bankName: faker.lorem.word(5),
    routingNumber: faker.finance.account(9),
    accountNumber: faker.finance.account(9),
  };
}

export function generateRandomTransaction(receiverId: string): Transaction {
  return {
    transactionType: faker.random.arrayElement(["payment", "request"]),
    receiverId: receiverId,
    amount: Number(faker.finance.amount(1, 10000, 0)),
    description: faker.lorem.words(),
  };
}

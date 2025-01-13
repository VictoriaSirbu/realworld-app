export type User = {
  id?: string;
  uuid?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  defaultPrivacyLevel: string;
  balance: number;
  createdAt?: string;
  modifiedAt?: string;
};

export type BankAccount = {
  id?: string;
  uuid?: string;
  userId?: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  isDeleted?: boolean;
  createdAt?: string;
  modifiedAt?: string;
};

export type Transaction = {
  id?: string;
  uuid?: string;
  transactionType: "payment" | "request";
  amount: number;
  description: string;
  receiverId: string;
  senderId?: string;
  status?: string;
  requestStatus?: string;
  receiverName?: string;
  receiverAvatar?: string;
  likes?: string[];
  comments?: TransactionComment[];
  createdAt?: string;
  modifiedAt?: string;
};

export type TransactionComment = {
  id: string;
  uuid: string;
  content: string;
  userId: string;
  transactionId: string;
  createdId: string;
  modifiedAt: string;
};

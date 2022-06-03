export type User = {
  email?: string;
  phone?: string;
  provider?: string;
  created?: string;
  lastSignIn?: string;
  uuid?: string;
  id?: string;
};

export type UserAccountType = {
  avatar_url?: string;
  username?: string;
  cash_address?: string;
  cash_balance?: number;
};

export type UUID = {
  uuid: string;
};


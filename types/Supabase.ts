export type ViewType =
  | "sign_in"
  | "sign_up"
  | "forgotten_password"
  | "magic_link"
  | "update_password";

export type Profile = {
  id: string;
  avatar_url: string;
  username: string;
  website: string;
  updated_at: string;
  cash_address: string;
  cash_balance: number;
};

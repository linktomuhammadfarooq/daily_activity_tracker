export type UserRole = "super_admin" | "user";

export type AppUser = {
  uid: string;
  email: string;
  role: UserRole;
  createdAt?: number;
};

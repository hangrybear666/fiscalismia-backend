/**
 * user object containing userId, userName and userEmail extracted from the db.
 * @table public.um_users
 */
export type User = {
  userId: number;
  userName: string;
  userEmail: string;
};

/**
 * User Credentials Object used for e.g. Account Creation and INSERT into table public.um_users.
 * @table public.um_users
 */
export type UserCredentials = {
  username: string;
  email: string;
  password: string;
};

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  token?: string;
  roles: 'User' | 'Manager' | 'Admin';
  managerId?: string; // optional for Users under a Manager
}

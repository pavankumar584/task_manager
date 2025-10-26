import { hashPassword } from "../utils/hash";

export const adminConfig = {
  email: "admin@gmail.com",
  passwordHash: hashPassword("Admin@123"),
}; 
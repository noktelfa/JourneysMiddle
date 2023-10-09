import { DefaultSession, DefaultUser } from "next-auth";

export enum Role {
  user = "user",
  admin = "admin",
}

interface IUser extends DefaultUser {
  role?: Role;
}
declare module "next-auth" {
  interface User extends IUser {
    name: string
    admin: boolean,
    issuer: 'The Journey\'s Middle',
  }
  interface Session {
    user?: {
      name: string,
      admin: boolean,
      issuer: 'The Journey\'s Middle',
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}


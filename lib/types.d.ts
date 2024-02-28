import { Role, User } from "@prisma/client";
import { Jwt } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}

export interface UserDataType extends User {
  followers: Follows[];
  following: Follows[];
  posts: Post[];
}

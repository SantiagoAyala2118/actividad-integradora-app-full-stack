import { User } from "../models/User.ts";
import type { PublicUser } from "../types/index.ts";

export const toPublicUser = (user: User): PublicUser => {
  return {
    id: user.id!,
    name: user.name,
    email: user.email,
    roleId: user.roleId,
  };
};

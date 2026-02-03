import { Context } from "grammy";
import { ADMINS } from "../config/index.js";

export function isAdmin(ctx: Context): boolean {
  const userId = ctx.from?.id;
  if (!userId) return false;

  return ADMINS.has(userId);
}

export function isAdminByUserId(userId: number): boolean {
  return ADMINS.has(userId);
}

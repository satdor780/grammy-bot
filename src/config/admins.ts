import 'dotenv/config';

const adminIds = process.env.ADMIN_IDS
    ?.split(',')
    .map(id => Number(id.trim()))
    .filter(Boolean) ?? [];

export const ADMINS = new Set<number>(adminIds);

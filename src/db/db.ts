import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: Bun.env.DB_NAME! });
export const DB = drizzle(client);
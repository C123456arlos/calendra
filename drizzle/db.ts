import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from './schema'
const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!)
// const sql = neon('postgresql://neondb_owner:npg_84ZGovteVNlY@ep-gentle-fire-ad9azf97-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
export const db = drizzle(sql, { schema })


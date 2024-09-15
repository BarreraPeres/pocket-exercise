import { drizzle } from "drizzle-orm/postgres-js"
import "dotenv/config"
import { env } from "../env/env";
import postgres from "postgres";
import * as schema from "./schema/exercise-completions"


export const client = postgres(env.data.POSTGRES_URL)
export const db = drizzle(client, { schema })



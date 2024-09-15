import { defineConfig } from "drizzle-kit"
import { env } from "./src/env/env"


export default defineConfig({
    schema: "./src/postgresql/schema/index.ts",
    out: "./src/postgresql/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: env.data.POSTGRES_URL
    },

})
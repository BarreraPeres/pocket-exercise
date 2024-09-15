import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    POSTGRES_URL: z.string().url()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error("error in environment variables", _env.error.format())
    throw new Error("error in environment variables")
}


export const env = _env
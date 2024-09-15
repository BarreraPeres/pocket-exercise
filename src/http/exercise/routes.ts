import { FastifyInstance } from "fastify"
import { create } from "./create"
import { completion } from "./completion"
import { pending } from "./get-pending"
import { summary } from "./get-summary"

export async function exerciseRoutes(app: FastifyInstance) {
    app.post("/exercice", create)
    app.post("/completion", completion)
    app.get("/pending", pending)
    app.get("/summary", summary)
}
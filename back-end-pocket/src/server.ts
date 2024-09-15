import { fastify } from "fastify"
import { exerciseRoutes } from "./http/exercise/routes"
import fastifyCors from "@fastify/cors"

const app = fastify()

app.register(fastifyCors, {
    origin: "*"
})

app.register(exerciseRoutes)

app.listen({ port: 5000 }).then((address) => {
    console.log(`server is running ${address}`)
})

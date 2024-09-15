import { FastifyReply, FastifyRequest } from "fastify";
import { getWeekPendingExercises } from "../../use-cases/get-week-pending-exercises";

export async function pending(request: FastifyRequest, reply: FastifyReply) {


    const { pendingExercise } = await getWeekPendingExercises()

    return reply.status(201).send({
        pendingExercise
    })

}
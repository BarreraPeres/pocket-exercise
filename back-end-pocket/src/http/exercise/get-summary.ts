import { FastifyReply, FastifyRequest } from "fastify";
import { getWeekSummary } from "../../use-cases/get-week-summary";

export async function summary(request: FastifyRequest, reply: FastifyReply) {


    const { summary } = await getWeekSummary()

    return reply.status(201).send({
        summary
    })

}
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createExercise } from "../../use-cases/create-exercice";



export async function create(request: FastifyRequest, reply: FastifyReply) {

    const exerciceBody = z.object({
        type: z.string().min(3),
        desiredWeeklyFrequency: z.number(),
        series: z.string()
    })

    const { desiredWeeklyFrequency, series, type } = exerciceBody.parse(request.body)
    const { exercise } = await createExercise({ desiredWeeklyFrequency, type, series })

    return reply.status(201).send({
        exercise
    })

}
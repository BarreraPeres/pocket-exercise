import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createExerciseCompletion } from "../../use-cases/create-exercice-completation";

export async function completion(request: FastifyRequest, reply: FastifyReply) {

    const exerciseBody = z.object({
        exerciseId: z.string()
    })

    const { exerciseId } = exerciseBody.parse(request.body)
    const { exerciseCompletation } = await createExerciseCompletion({ exerciseId })

    return reply.status(201).send({
        exerciseCompletation
    })

}
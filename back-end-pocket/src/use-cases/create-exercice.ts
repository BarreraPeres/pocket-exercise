import { db } from "../postgresql/connection"
import { Exercise } from "../postgresql/schema/exercise"

interface CreateExerciseRequest {
    type: string
    desiredWeeklyFrequency: number
    series: string
}

export async function createExercise({
    type,
    desiredWeeklyFrequency,
    series
}: CreateExerciseRequest) {
    const [exercise] = await db
        .insert(Exercise)
        .values({
            desiredWeeklyFrequency, series, type
        })
        .returning()

    return { exercise }
}
import { and, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "../postgresql/connection"
import { Exercise, ExerciseCompletentions } from "../postgresql/schema"
import dayjs from "dayjs"
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

interface CreateExerciseCompletionRequest {
    exerciseId: string
}

export async function createExerciseCompletion({
    exerciseId
}: CreateExerciseCompletionRequest) {
    const currentYear = dayjs().year()
    const endDayOfWeek = dayjs().endOf("week").toDate()
    const firstDayOfWeek = dayjs().startOf("week").toDate()

    const exerciseCompletionCounts = db.$with('exercise_completion_counts').as(
        db
            .select({
                exerciseId: ExerciseCompletentions.exerciseId,
                completionCount: sql`COUNT(${ExerciseCompletentions.id})`.as(
                    'completionCount'
                ),
            })
            .from(ExerciseCompletentions)
            .where(
                and(
                    eq(ExerciseCompletentions.exerciseId, exerciseId),
                    sql`EXTRACT(YEAR FROM ${ExerciseCompletentions.createdAt}) = ${currentYear}`,
                    gte(ExerciseCompletentions.createdAt, firstDayOfWeek),
                    lte(ExerciseCompletentions.createdAt, endDayOfWeek)
                )
            )
            .groupBy(ExerciseCompletentions.exerciseId)
    )
    const result = await db
        .with(exerciseCompletionCounts)
        .select({
            isIncomplete: sql /*sql*/`
          COALESCE(${Exercise.desiredWeeklyFrequency}, 0) > COALESCE(${exerciseCompletionCounts.completionCount}, 0)
        `,
        })
        .from(Exercise)
        .leftJoin(exerciseCompletionCounts, eq(Exercise.id, exerciseCompletionCounts.exerciseId))
        .where(eq(Exercise.id, exerciseId))
        .limit(1)

    const { isIncomplete } = result[0]

    if (!isIncomplete) {
        throw new Error('Goal already completed this week!')
    }

    const [exerciseCompletation] = await db
        .insert(ExerciseCompletentions)
        .values({
            exerciseId,
        })
        .returning()

    return {
        exerciseCompletation
    }
}
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, asc, count, eq, sql } from 'drizzle-orm'
import { db } from '../postgresql/connection'
import { Exercise, ExerciseCompletentions } from '../postgresql/schema'

dayjs.extend(weekOfYear)

export async function getWeekPendingExercises() {
    const currentYear = dayjs().year()
    const currentWeek = dayjs().week()

    const exerciseCreatedUpToWeek = db.$with('exercise_created_up_to_week').as(
        db
            .select({
                id: Exercise.id,
                type: Exercise.type,
                series: Exercise.series,
                desiredWeeklyFrequency: Exercise.desiredWeeklyFrequency,
                createdAt: Exercise.createdAt,
            })
            .from(Exercise)
            .where(
                and(
                    sql`EXTRACT(YEAR FROM ${Exercise.createdAt}) <= ${currentYear}`,
                    sql`EXTRACT(WEEK FROM ${Exercise.createdAt}) <= ${currentWeek}`
                )
            )
    )

    const exerciseCompletionCounts = db.$with('exercise_completion_counts').as(
        db
            .select({
                exerciseId: Exercise.id,
                completionCount: count(ExerciseCompletentions.id).as('completionCount'),
            })
            .from(ExerciseCompletentions)
            .innerJoin(Exercise, eq(Exercise.id, ExerciseCompletentions.exerciseId))
            .groupBy(Exercise.id)
    )

    const pendingExercise = await db
        .with(exerciseCreatedUpToWeek, exerciseCompletionCounts)
        .select({
            id: exerciseCreatedUpToWeek.id,
            type: exerciseCreatedUpToWeek.type,
            series: exerciseCreatedUpToWeek.series,
            desiredWeeklyFrequency: exerciseCreatedUpToWeek.desiredWeeklyFrequency,
            completionCount:
                sql`COALESCE(${exerciseCompletionCounts.completionCount}, 0)`.mapWith(
                    Number
                ),
        })
        .from(exerciseCreatedUpToWeek)
        .orderBy(asc(exerciseCreatedUpToWeek.createdAt))
        .leftJoin(
            exerciseCompletionCounts,
            eq(exerciseCreatedUpToWeek.id, exerciseCompletionCounts.exerciseId)
        )

    return { pendingExercise }
}
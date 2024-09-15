import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, desc, eq, sql } from 'drizzle-orm'
import { db } from '../postgresql/connection'
import { Exercise, ExerciseCompletentions } from '../postgresql/schema'

dayjs.extend(weekOfYear)

export async function getWeekSummary() {
    const currentYear = dayjs().year()
    const currentWeek = 37
    const exercisesCreatedUpToWeek = db.$with('exercises_created_up_to_week').as(
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

    const exercicesCompletedInWeek = db.$with('exercices_completed_in_week').as(
        db
            .select({
                id: ExerciseCompletentions.id,
                type: Exercise.type,
                series: Exercise.series,
                createdAt: ExerciseCompletentions.createdAt,
                completionDate: sql`DATE(${ExerciseCompletentions.createdAt})`.as(
                    'completionDate'
                ),
            })
            .from(ExerciseCompletentions)
            .orderBy(desc(ExerciseCompletentions.createdAt))
            .innerJoin(Exercise, eq(Exercise.id, ExerciseCompletentions.exerciseId))
            .where(
                and(
                    sql`EXTRACT(YEAR FROM ${Exercise.createdAt}) = ${currentYear}`,
                    sql`EXTRACT(WEEK FROM ${Exercise.createdAt}) = ${currentWeek}`
                )
            )
    )

    const exercisesCompletedByWeekDay = db.$with('exercises_completed_by_week_day').as(
        db
            .select({
                completionDate: exercicesCompletedInWeek.completionDate,
                completions: sql<
                    { id: string; type: string; series: string; createdAt: string }[]
                > /* sql */`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${exercicesCompletedInWeek.id},
            'type', ${exercicesCompletedInWeek.type},
            'series', ${exercicesCompletedInWeek.series},
            'createdAt', ${exercicesCompletedInWeek.createdAt}
          )
        )
      `.as('completions'),
            })
            .from(exercicesCompletedInWeek)
            .groupBy(exercicesCompletedInWeek.completionDate)
    )

    type Summary = Record<
        string,
        { id: string; type: string; series: string; createdAt: string }[]
    >

    const [summary] = await db
        .with(exercisesCreatedUpToWeek, exercicesCompletedInWeek, exercisesCompletedByWeekDay)
        .select({
            completed: sql<number> /*sql*/`
        (SELECT COUNT(*) FROM ${exercicesCompletedInWeek})::DECIMAL
      `.mapWith(Number),
            total: sql<number> /*sql*/`
        (SELECT SUM(${exercisesCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${exercisesCreatedUpToWeek})::DECIMAL
      `.mapWith(Number),
            exercisesPerDay: sql<Summary> /*sql*/`
        JSON_OBJECT_AGG(${exercisesCompletedByWeekDay.completionDate}, ${exercisesCompletedByWeekDay.completions})
      `,
        })
        .from(exercisesCompletedByWeekDay)

    return { summary }
}
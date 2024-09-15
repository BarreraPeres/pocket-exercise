import dayjs from "dayjs";
import { client, db } from "../postgresql/connection";
import { Exercise } from "../postgresql/schema";
import { ExerciseCompletentions } from "../postgresql/schema/exercise-completions";

async function seed() {
    const exercises = await db
        .insert(Exercise)
        .values([
            {
                type: "Flexões Decline",
                series: "4x15",
                desiredWeeklyFrequency: 4
            },
            {
                type: "Flexões Diamond",
                series: "3x8",
                desiredWeeklyFrequency: 3
            },
            {
                type: "Flexões Arqueadas",
                series: "3x10",
                desiredWeeklyFrequency: 3
            },
        ]).returning()

    const startWeek = dayjs().startOf("week")

    await db.insert(ExerciseCompletentions).values([
        {
            exerciseId: exercises[0].id, createdAt: startWeek.toDate()
        },
        {
            exerciseId: exercises[1].id, createdAt: startWeek.add(1, "day").toDate()
        }
    ])

}


seed().then(() => {
    console.log("this db the seeded 🌱")
    client.end()
})
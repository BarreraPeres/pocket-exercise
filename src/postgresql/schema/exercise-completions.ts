import { randomUUID } from "node:crypto";
import { pgTable, text, timestamp, } from "drizzle-orm/pg-core";
import { Exercise } from "./exercise";


export const ExerciseCompletentions = pgTable("exercise-completentions", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    exerciseId: text("exercise_id").references(() => Exercise.id)
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
})
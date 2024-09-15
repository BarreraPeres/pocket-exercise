import { randomUUID } from "node:crypto";
import { integer, pgTable, text, timestamp, } from "drizzle-orm/pg-core";


export const Exercise = pgTable("exercises", {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    type: text("type")
        .notNull(),
    series: text("series")
        .notNull(),
    desiredWeeklyFrequency: integer('desired_weekly_frequency')
        .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
})
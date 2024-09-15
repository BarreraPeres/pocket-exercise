CREATE TABLE IF NOT EXISTS "exercise-completentions" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"series" text NOT NULL,
	"desired_weekly_frequency" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise-completentions" ADD CONSTRAINT "exercise-completentions_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

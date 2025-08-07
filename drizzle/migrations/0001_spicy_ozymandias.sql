ALTER TABLE "schedules" DROP CONSTRAINT "schedules_timezone_unique";--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "clerkUserId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_clerkUserId_unique" UNIQUE("clerkUserId");
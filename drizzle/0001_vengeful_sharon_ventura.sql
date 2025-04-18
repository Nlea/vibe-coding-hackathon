ALTER TABLE "vinyls" DROP CONSTRAINT "vinyls_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "artists[]" text;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "owner" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "genre[]" text;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "tracklist[]" text;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "style[]" text;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "discogs_master_url" text;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "discogs_uri" text;--> statement-breakpoint
ALTER TABLE "vinyls" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "vinyls" DROP COLUMN "artist";--> statement-breakpoint
ALTER TABLE "vinyls" DROP COLUMN "genre";--> statement-breakpoint
ALTER TABLE "vinyls" DROP COLUMN "discogs_id";--> statement-breakpoint
ALTER TABLE "vinyls" DROP COLUMN "barcode";--> statement-breakpoint
ALTER TABLE "vinyls" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "vinyls" DROP COLUMN "updated_at";
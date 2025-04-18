CREATE TABLE "tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"vinyl_id" integer NOT NULL,
	"title" text NOT NULL,
	"duration" integer,
	"position" varchar(10),
	"bpm" integer,
	"key" varchar(10),
	"tags" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vinyls" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"year" integer,
	"genre" text,
	"label" text,
	"discogs_id" varchar(50),
	"barcode" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_vinyl_id_vinyls_id_fk" FOREIGN KEY ("vinyl_id") REFERENCES "public"."vinyls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vinyls" ADD CONSTRAINT "vinyls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
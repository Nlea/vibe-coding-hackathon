import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vinyls = pgTable("vinyls", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artists: text("artists[]"),
  label: text("label"),
  year: integer("year"),
  owner: text("owner").notNull(),
  genre: text("genre[]"),
  tracklist: text("tracklist[]"),
  style:  text("style[]"),
  discogsMasterUrl: text("discogs_master_url"),
  discogsUri: text("discogs_uri"),
  imageUrl: text("image_url"),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  vinylId: integer("vinyl_id").notNull().references(() => vinyls.id),
  title: text("title").notNull(),
  duration: integer("duration"),
  position: varchar("position", { length: 10 }), // e.g., "A1", "B2"
  bpm: integer("bpm"),
  key: varchar("key", { length: 10 }),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type NewUser = typeof users.$inferInsert;
export type NewVinyl = typeof vinyls.$inferInsert;
export type NewTrack = typeof tracks.$inferInsert;

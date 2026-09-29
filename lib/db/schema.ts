import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  industry: text("industry").notNull(),
  size_band: text("size_band").notNull(), // e.g. "20-50", "50-200"
  stage: text("stage").notNull(), // e.g. "Series A", "Series B"
  location: text("location").default("Bengaluru, India"),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const snapshots = pgTable(
  "snapshots",
  {
    id: serial("id").primaryKey(),
    company_id: integer("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    captured_at: timestamp("captured_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    raw: jsonb("raw").notNull(), // Raw scraped pages, search snippets
    extracted: jsonb("extracted").notNull(), // Structured intel { funding, team, hiring, product, pains }
    source_map: jsonb("source_map").notNull(), // Field to source URL, tier, confidence, conflicts
  },
  (table) => [
    index("snapshot_company_captured_idx").on(
      table.company_id,
      table.captured_at
    ),
  ]
);

export const signals = pgTable(
  "signals",
  {
    id: serial("id").primaryKey(),
    company_id: integer("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    snapshot_from: integer("snapshot_from").references(() => snapshots.id),
    snapshot_to: integer("snapshot_to").references(() => snapshots.id),
    type: text("type").notNull(), // funding, hiring, leadership, product, expansion, noise
    description: text("description").notNull(),
    is_meaningful: boolean("is_meaningful").default(false).notNull(),
    reason: text("reason").notNull(),
    urgency: text("urgency").default("medium").notNull(), // high, medium, low
    detected_at: timestamp("detected_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("signals_company_idx").on(table.company_id, table.detected_at),
  ]
);

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  company_id: integer("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name"), // null if only role is identified
  role: text("role").notNull(),
  persona: text("persona").notNull(), // e.g. "Head of Operations", "VP Engineering"
  persona_reason: text("persona_reason").notNull(),
  source_url: text("source_url").notNull(),
  confidence: text("confidence").default("medium").notNull(), // high, medium, low
});

export const scores = pgTable(
  "scores",
  {
    id: serial("id").primaryKey(),
    company_id: integer("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    computed_at: timestamp("computed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    fit: integer("fit").notNull(), // 0-100
    timing: integer("timing").notNull(), // 0-100
    reach: integer("reach").notNull(), // 0-100
    confidence: numeric("confidence", { precision: 4, scale: 2 }).notNull(), // 0.00 - 1.00
    total: integer("total").notNull(), // 0-100
    reasoning: text("reasoning").notNull(),
  },
  (table) => [
    index("scores_company_computed_idx").on(
      table.company_id,
      table.computed_at
    ),
  ]
);

export const outreach = pgTable("outreach", {
  id: serial("id").primaryKey(),
  company_id: integer("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  person_id: integer("person_id").references(() => people.id),
  trigger_signal_id: integer("trigger_signal_id").references(() => signals.id),
  draft: text("draft").notNull(),
  why_note: text("why_note").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const runs = pgTable("runs", {
  id: serial("id").primaryKey(),
  company_id: integer("company_id").references(() => companies.id, {
    onDelete: "cascade",
  }),
  started_at: timestamp("started_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  finished_at: timestamp("finished_at", { withTimezone: true }),
  status: text("status").notNull(), // "running", "completed", "failed"
  log: jsonb("log").notNull(), // Array of { step, status, timestamp, details }
});

export const config = pgTable("config", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  snapshots: many(snapshots),
  signals: many(signals),
  people: many(people),
  scores: many(scores),
  outreach: many(outreach),
  runs: many(runs),
}));

export const snapshotsRelations = relations(snapshots, ({ one, many }) => ({
  company: one(companies, {
    fields: [snapshots.company_id],
    references: [companies.id],
  }),
  signalsTo: many(signals, { relationName: "snapshotTo" }),
}));

export const signalsRelations = relations(signals, ({ one }) => ({
  company: one(companies, {
    fields: [signals.company_id],
    references: [companies.id],
  }),
  snapshotTo: one(snapshots, {
    fields: [signals.snapshot_to],
    references: [snapshots.id],
    relationName: "snapshotTo",
  }),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
  company: one(companies, {
    fields: [scores.company_id],
    references: [companies.id],
  }),
}));

export const peopleRelations = relations(people, ({ one, many }) => ({
  company: one(companies, {
    fields: [people.company_id],
    references: [companies.id],
  }),
  outreach: many(outreach),
}));

export const outreachRelations = relations(outreach, ({ one }) => ({
  company: one(companies, {
    fields: [outreach.company_id],
    references: [companies.id],
  }),
  person: one(people, {
    fields: [outreach.person_id],
    references: [people.id],
  }),
  triggerSignal: one(signals, {
    fields: [outreach.trigger_signal_id],
    references: [signals.id],
  }),
}));

export const runsRelations = relations(runs, ({ one }) => ({
  company: one(companies, {
    fields: [runs.company_id],
    references: [companies.id],
  }),
}));

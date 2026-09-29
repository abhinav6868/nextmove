import { z } from "zod";

export const KeyPersonSchema = z.object({
  name: z.string(),
  role: z.string(),
  source_url: z.string(),
});

export const OpenRoleSchema = z.object({
  title: z.string(),
  department: z.string(),
  source_url: z.string().optional(),
});

export const NewsItemSchema = z.object({
  title: z.string(),
  date: z.string(),
  source_url: z.string(),
});

export const CompanyIntelSchema = z.object({
  name: z.string(),
  industry: z.string(),
  stage: z.string(), // "Seed" | "Series A" | "Series B" | "Series C" | "Bootstrapped"
  size_band: z.string(), // "1-20" | "20-50" | "50-200" | "200-500"
  location: z.string(),
  description: z.string(),
  employee_count: z.number().optional(),
  funding_total: z.string().optional(),
  latest_round: z
    .object({
      round: z.string(),
      amount: z.string(),
      date: z.string(),
      source_url: z.string(),
    })
    .optional(),
  key_people: z.array(KeyPersonSchema).default([]),
  open_roles: z.array(OpenRoleSchema).default([]),
  recent_news: z.array(NewsItemSchema).default([]),
  likely_pains: z.array(z.string()).default([]),
  what_to_know_before_approaching: z.string(),
  source_map: z
    .record(
      z.string(),
      z.object({
        source_url: z.string(),
        tier: z.number(),
        date: z.string().optional(),
      })
    )
    .default({}),
});

export type CompanyIntel = z.infer<typeof CompanyIntelSchema>;

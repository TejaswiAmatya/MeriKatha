import { z } from "zod";

export const translateSchema = z.object({
  text: z.string().min(1).max(5000),
  targetLang: z.enum(["en", "ne"]).default("en"),
});

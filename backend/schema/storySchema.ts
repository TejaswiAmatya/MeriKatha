import { z } from "zod";

const THEME_VALUES = ['harassment', 'postpartum', 'domestic', 'career', 'diaspora', 'general'] as const;

export const storySchema = z.object({
  content: z.string().min(10).max(500),
  theme: z.enum(THEME_VALUES),
  circleId: z.string().optional(),
});

export type StoryInput = z.infer<typeof storySchema>;

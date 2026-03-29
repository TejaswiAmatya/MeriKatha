import { z } from "zod";

const THEME_VALUES = ['harassment', 'postpartum', 'domestic', 'career', 'diaspora', 'general'] as const;

// Max ~2.5MB base64 string (roughly 2 minutes of compressed audio)
const MAX_AUDIO_BASE64_LENGTH = 2_500_000;

export const storySchema = z
  .object({
    content: z.string().max(500).optional().default(""),
    theme: z.enum(THEME_VALUES),
    circleId: z.string().optional(),
    audioBase64: z
      .string()
      .max(MAX_AUDIO_BASE64_LENGTH)
      .optional(),
  })
  .refine(
    (data) => (data.content && data.content.length >= 10) || data.audioBase64,
    {
      message:
        "Katha lekhnus (kam se kam 10 characters) ya audio record garnus",
    }
  );

export type StoryInput = z.infer<typeof storySchema>;

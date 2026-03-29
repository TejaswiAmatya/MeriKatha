import { Request, Response } from "express";
import Groq from "groq-sdk";
import { prisma } from "../lib/prisma";
import { storySchema } from "../schema/storySchema";
import { commentSchema } from "../schema/commentSchema";
import { translateSchema } from "../schema/translateSchema";
import { checkStoryContent } from "../src/storyContentCheck";

function getGroq(): Groq | null {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return null;
  return new Groq({ apiKey: key });
}

const VALID_THEMES = [
  "harassment",
  "postpartum",
  "domestic",
  "career",
  "diaspora",
  "general",
] as const;

export const getStories = async (req: Request, res: Response) => {
  const themeParam = req.query.theme as string | undefined;
  const theme =
    themeParam && (VALID_THEMES as readonly string[]).includes(themeParam)
      ? themeParam
      : undefined;
  try {
    const stories = await prisma.story.findMany({
      where: { status: "APPROVED", ...(theme ? { theme } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { _count: { select: { comments: true } } },
    });
    res.json({ success: true, data: stories });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
  }
};

export const setStories = async (req: Request, res: Response) => {
  const parsed = storySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "Katha lekhnus (kam se kam 10 characters) ya audio record garnus",
    });
  }

  const userId = req.user?.sub ?? null;

  try {
    const { content, audioBase64, ...rest } = parsed.data;

    // Content moderation only runs on text (audio-only stories skip it)
    if (content && content.length >= 10) {
      const check = checkStoryContent(content);

      if (!check.ok) {
        await prisma.story.create({
          data: { ...rest, content: content || "", audioBase64, status: "DELETED", flagCode: check.code, userId },
        });
        return res.status(422).json({
          success: false,
          data: null,
          error: check.message,
          code: check.code,
          showResources: check.showResources,
        });
      }

      const story = await prisma.story.create({
        data: { ...rest, content: content || "", audioBase64, status: "APPROVED", userId },
      });
      return res.status(201).json({
        success: true,
        data: story,
        flags: check.flags,
      });
    }

    // Audio-only story (no text or text < 10 chars) — skip content moderation
    const story = await prisma.story.create({
      data: { ...rest, content: content || "", audioBase64, status: "APPROVED", userId },
    });
    res.status(201).json({ success: true, data: story });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
  }
};

export const deleteStory = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.sub;
  try {
    const story = await prisma.story.findFirst({ where: { id, status: "APPROVED" } });
    if (!story) {
      return res.status(404).json({ success: false, data: null, error: "Yo katha fhelaparena." });
    }
    if (story.userId !== userId) {
      return res.status(403).json({ success: false, data: null, error: "Yo timi ko katha hoina." });
    }
    await prisma.story.delete({ where: { id } });
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, data: null, error: "Kei bhayo yaar, feri try garna hai" });
  }
};

export const suneinStory = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const story = await prisma.story.update({
      where: { id },
      data: { suneinCount: { increment: 1 } },
    });
    res.json({ success: true, data: story });
  } catch {
    res.status(404).json({
      success: false,
      data: null,
      error: "Yo katha ferina — sायद delete bhaisakyo",
    });
  }
};

export const getTrending = async (_req: Request, res: Response) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  try {
    const stories = await prisma.story.findMany({
      where: { status: "APPROVED", createdAt: { gte: sevenDaysAgo } },
      orderBy: { suneinCount: "desc" },
      take: 5,
      select: { id: true, content: true, suneinCount: true, createdAt: true },
    });
    res.json({ success: true, data: stories });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const comments = await prisma.comment.findMany({
      where: { storyId: id, parentId: null },
      orderBy: { createdAt: "asc" },
      include: {
        replies: { orderBy: { createdAt: "asc" } },
      },
    });
    res.json({ success: true, data: comments });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "Kei lekhnus ta — comment khali huna sakdaina",
    });
  }

  const id = req.params.id as string;
  try {
    const story = await prisma.story.findFirst({
      where: { id, status: "APPROVED" },
      select: { id: true },
    });
    if (!story) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Yo katha fhelaparidena",
      });
    }

    if (parsed.data.parentId) {
      const parent = await prisma.comment.findFirst({
        where: { id: parsed.data.parentId, storyId: id },
        select: { id: true },
      });
      if (!parent) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Parent comment fhelaparidena",
        });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: parsed.data.content,
        storyId: id,
        isAnonymous: true,
        parentId: parsed.data.parentId ?? null,
      },
    });
    res.status(201).json({ success: true, data: comment });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
      select: { id: true, likeCount: true },
    });
    res.json({ success: true, data: comment });
  } catch {
    res.status(404).json({
      success: false,
      data: null,
      error: "Comment fhelaparidena",
    });
  }
};

export const suneinComment = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { suneinCount: { increment: 1 } },
      select: { id: true, suneinCount: true },
    });
    res.json({ success: true, data: comment });
  } catch {
    res.status(404).json({
      success: false,
      data: null,
      error: "Comment fhelaparidena",
    });
  }
};

export const translateText = async (req: Request, res: Response) => {
  const parsed = translateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "text field required",
    });
  }

  try {
    const groq = getGroq();
    if (!groq) {
      return res.status(503).json({
        success: false,
        data: null,
        error: "Translate service ahile available chaina — server maa GROQ_API_KEY set garnus.",
      });
    }

    const { text, targetLang } = parsed.data;
    const prompt =
      targetLang === "en"
        ? `Translate the following Nepali or Nepali-English mixed text to natural, warm English. Preserve the emotional tone. Return ONLY the translated text — no explanations, no quotes, no labels.\n\n${text}`
        : `Translate the following English text to natural spoken Nepali (Devanagari script). Use conversational Nepali, not formal/literary. Preserve the emotional tone. Return ONLY the translated text — no explanations, no quotes, no labels.\n\n${text}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });
    const translatedText = completion.choices[0]?.message?.content ?? "";
    res.json({ success: true, data: { translatedText } });
  } catch (err) {
    console.error('Translate error:', err)
    res.status(500).json({
      success: false,
      data: null,
      error: "Anuvad garna sakiena — feri try garnus",
    });
  }
};

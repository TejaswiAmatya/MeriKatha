import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { storySchema } from "../schema/storySchema";
import { checkStoryContent } from "../src/storyContentCheck";

export const getStories = async (_req: Request, res: Response) => {
  try {
    const stories = await prisma.story.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 50,
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
      error: "Aphno katha lekhnuhos — kam se kam 10 characters chahiyo",
    });
  }

  try {
    const { content } = parsed.data;
    const check = checkStoryContent(content);

    if (!check.ok) {
      // Save flagged story for review, mark as DELETED
      await prisma.story.create({
        data: {
          ...parsed.data,
          status: "DELETED",
          flagCode: check.code,
        },
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
      data: {
        ...parsed.data,
        status: "APPROVED",
      },
    });
    res.status(201).json({
      success: true,
      data: story,
      flags: check.flags,
    });
  } catch {
    res.status(500).json({
      success: false,
      data: null,
      error: "Kei bhayo yaar, feri try garna hai",
    });
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

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../lib/jwt";

export const getJoinedCircles = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  try {
    const memberships = await prisma.circleMember.findMany({
      where: { userId },
      select: { circle: { select: { circleId: true } } },
    });
    const circleIds = memberships.map((m) => m.circle.circleId);
    res.json({ success: true, data: circleIds });
  } catch {
    res.status(500).json({ success: false, data: null, error: "Kei bhayo yaar, feri try garna hai" });
  }
};

export const getCircle = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  try {
    const circle = await prisma.circle.findUnique({ where: { slug } });
    if (!circle) {
      return res.status(404).json({ success: false, data: null, error: "Yo circle fhelaparena" });
    }

    let joined = false;
    const token = req.cookies?.token;
    if (token) {
      try {
        const payload = verifyToken(token);
        const member = await prisma.circleMember.findUnique({
          where: { userId_circleId: { userId: payload.sub, circleId: circle.id } },
        });
        joined = !!member;
      } catch {
        // not authenticated — joined stays false
      }
    }

    res.json({ success: true, data: { ...circle, joined } });
  } catch {
    res.status(500).json({ success: false, data: null, error: "Kei bhayo yaar, feri try garna hai" });
  }
};

export const getCircleStories = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  try {
    const circle = await prisma.circle.findUnique({ where: { slug }, select: { circleId: true } });
    if (!circle) {
      return res.status(404).json({ success: false, data: null, error: "Yo circle fhelaparena" });
    }
    const stories = await prisma.story.findMany({
      where: { status: "APPROVED", circleId: circle.circleId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { _count: { select: { comments: true } } },
    });
    res.json({ success: true, data: stories });
  } catch {
    res.status(500).json({ success: false, data: null, error: "Kei bhayo yaar, feri try garna hai" });
  }
};

export const joinCircle = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const slug = req.params.slug as string;
  try {
    const circle = await prisma.circle.findUnique({ where: { slug } });
    if (!circle) {
      return res.status(404).json({ success: false, data: null, error: "Yo circle fhelaparena" });
    }

    const existing = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId: circle.id } },
    });
    if (existing) {
      return res.json({ success: true, data: { memberCount: circle.memberCount, joined: true } });
    }

    await prisma.circleMember.create({ data: { userId, circleId: circle.id } });
    const updated = await prisma.circle.update({
      where: { id: circle.id },
      data: { memberCount: { increment: 1 } },
      select: { memberCount: true },
    });
    res.json({ success: true, data: { memberCount: updated.memberCount, joined: true } });
  } catch {
    res.status(500).json({ success: false, data: null, error: "Kei bhayo yaar, feri try garna hai" });
  }
};

export const leaveCircle = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const slug = req.params.slug as string;
  try {
    const circle = await prisma.circle.findUnique({ where: { slug } });
    if (!circle) {
      return res.status(404).json({ success: false, data: null, error: "Yo circle fhelaparena" });
    }

    const existing = await prisma.circleMember.findUnique({
      where: { userId_circleId: { userId, circleId: circle.id } },
    });
    if (!existing) {
      return res.json({ success: true, data: { memberCount: circle.memberCount, joined: false } });
    }

    await prisma.circleMember.delete({
      where: { userId_circleId: { userId, circleId: circle.id } },
    });
    const newCount = Math.max(0, circle.memberCount - 1);
    await prisma.circle.update({
      where: { id: circle.id },
      data: { memberCount: newCount },
    });
    res.json({ success: true, data: { memberCount: newCount, joined: false } });
  } catch {
    res.status(500).json({ success: false, data: null, error: "Kei bhayo yaar, feri try garna hai" });
  }
};

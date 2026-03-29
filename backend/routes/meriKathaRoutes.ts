import express from "express";
import {
  getStories,
  setStories,
  suneinStory,
  deleteStory,
  getTrending,
  getComments,
  createComment,
  likeComment,
  suneinComment,
  translateText,
} from "../controllers/meriKathaControllers";
import { requireAuth } from "../middleware/auth";

const meriKathaRouter = express.Router();

/**
 * @swagger
 * /api/stories:
 *   get:
 *     summary: Get all stories
 *     description: Fetch the latest 50 stories, newest first. Sabai kathaharuko list.
 *     tags:
 *       - Stories
 *     responses:
 *       200:
 *         description: Stories fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Kei bhayo yaar, feri try garna hai"
 */
meriKathaRouter.get("/stories", getStories);

/**
 * @swagger
 * /api/stories:
 *   post:
 *     summary: Share a new story
 *     description: Aphno katha share gara — anonymously. Content 10–500 characters hunu parcha.
 *     tags:
 *       - Stories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoryInput'
 *     responses:
 *       201:
 *         description: Story created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Story'
 *       400:
 *         description: Validation failed — content too short or missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Aphno katha lekh ta — kam se kam 10 characters chahiyo"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Kei bhayo yaar, feri try garna hai"
 */
meriKathaRouter.post("/stories", requireAuth, setStories);

/**
 * @swagger
 * /api/stories/{id}/sunein:
 *   post:
 *     summary: Sunein a story
 *     description: |
 *       "Maine suna" — increment the sunein count for a story.
 *       No body needed, just the story ID in the path.
 *     tags:
 *       - Stories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The story ID (cuid)
 *         example: clxyz123abc
 *     responses:
 *       200:
 *         description: Sunein count incremented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Story'
 *       404:
 *         description: Story not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Yo katha ferina — sायद delete bhaisakyo"
 */
meriKathaRouter.post("/stories/:id/sunein", suneinStory);
meriKathaRouter.delete("/stories/:id", requireAuth, deleteStory);

meriKathaRouter.get("/stories/trending", getTrending);
meriKathaRouter.get("/stories/:id/comments", getComments);
meriKathaRouter.post("/stories/:id/comments", createComment);
meriKathaRouter.post("/comments/:id/like", likeComment);
meriKathaRouter.post("/comments/:id/sunein", suneinComment);
meriKathaRouter.post("/translate", translateText);

export default meriKathaRouter;

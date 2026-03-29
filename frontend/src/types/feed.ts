export interface Circle {
  id: string;
  name: string;
  enName: string;
  initial: string;
  color: string;
  slug: string;
}

export interface Flair {
  label: string;
  bg: string;
  text: string;
}

export interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  storyId: string;
  parentId: string | null;
  likeCount: number;
  suneinCount: number;
  createdAt: string;
  replies?: Comment[];
}

export interface Story {
  id: string;
  circleId: string;
  title: string;
  body: string;
  audioBase64?: string | null;
  tags: string[];
  flair: Flair | null;
  votes: number;
  comments: number;
  createdAt: Date;
  theme: string;
  userId?: string;
}

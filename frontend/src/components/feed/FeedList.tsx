import type { Story } from "../../types/feed";
import { PostCard } from "./PostCard";
import { BentoBlock } from "./BentoBlock";
import { StoryInput } from "./StoryInput";

export function FeedList({
  stories,
  onNewStory,
  onDelete,
  circleId,
  composerOpen,
  onComposerOpenChange,
}: {
  stories: Story[];
  onNewStory: (story: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
  circleId?: string;
  composerOpen?: boolean;
  onComposerOpenChange?: (open: boolean) => void;
}) {
  const items: React.ReactNode[] = [];

  items.push(
    <StoryInput
      key="input"
      onSubmit={onNewStory}
      circleId={circleId}
      open={composerOpen}
      onOpenChange={onComposerOpenChange}
    />,
  );
  items.push(<BentoBlock key="bento-0" variant={0} />);

  stories.forEach((story) => {
    items.push(<PostCard key={story.id} story={story} onDelete={onDelete} />);
  });

  return <div className="flex flex-col gap-2">{items}</div>;
}

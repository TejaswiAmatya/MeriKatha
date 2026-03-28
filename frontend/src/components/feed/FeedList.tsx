import type { Story } from '../../types/feed'
import { PostCard } from './PostCard'
import { BentoBlock } from './BentoBlock'
import { StoryInput } from './StoryInput'

export function FeedList({
  stories,
  onNewStory,
}: {
  stories: Story[]
  onNewStory: (text: string) => void
}) {
  const items: React.ReactNode[] = []
  let bentoIndex = 0

  items.push(<StoryInput key="input" onSubmit={onNewStory} />)

  stories.forEach((story, i) => {
    items.push(<PostCard key={story.id} story={story} />)

    if ((i + 1) % 3 === 0) {
      items.push(<BentoBlock key={`bento-${bentoIndex}`} variant={bentoIndex} />)
      bentoIndex++
    }
  })

  return <div className="flex flex-col gap-2">{items}</div>
}

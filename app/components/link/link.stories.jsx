import { Link } from '~/components/link';
import { StoryContainer } from '../../../.storybook/story-container';

export default {
  title: 'Link',
};

export const Default = () => (
  <StoryContainer style={{ fontSize: 18 }}>
    <Link href="https://sameer-analytics.pages.dev/">Primary link</Link>
    <Link secondary href="https://www.linkedin.com/in/mahdeen-sameer-khan-892739232/">
      Secondary link
    </Link>
  </StoryContainer>
);
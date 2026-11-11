import { SitePage } from '@/components/blocks/registry';

export const revalidate = 60;

export default function HomePage() {
  return <SitePage pageSlug="/" />;
}

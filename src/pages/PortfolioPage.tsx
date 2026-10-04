import FeaturedProjects from '@/components/FeaturedProjects';
import { useSEO } from '@/hooks/useSEO';

export default function PortfolioPage() {
  useSEO({
    title: 'Cloud Projects & Serverless Architecture | Ojal Rathee',
    description:
      'Explore AWS cloud architectures, event-driven serverless systems, and full-stack applications created by Ojal Rathee (ojalrathee).',
    canonicalPath: '/portfolio',
    keywords:
      'ojalrathee projects, Ojal Rathee portfolio, cloud architecture, serverless AWS, dev.ojalrathee.com',
  });

  return <FeaturedProjects />;
}


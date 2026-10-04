import About from '@/components/About';
import { useSEO } from '@/hooks/useSEO';

export default function AboutPage() {
  useSEO({
    title: 'Ojal Rathee | Cloud Software Engineer & Systems Architect',
    description:
      'Official portfolio and engineering projects of Ojal Rathee (ojalrathee). Specializing in AWS Cloud architecture, serverless infrastructure, TypeScript, React, and backend systems at dev.ojalrathee.com.',
    canonicalPath: '/',
    keywords:
      'ojalrathee, Ojal Rathee, dev.ojalrathee.com, ojal rathee cloud engineer, ojal rathee portfolio, software engineer',
  });

  return <About />;
}


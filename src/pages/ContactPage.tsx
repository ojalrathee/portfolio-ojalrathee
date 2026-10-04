import ContactSection from '@/components/ContactSection';
import { useSEO } from '@/hooks/useSEO';

export default function ContactPage() {
  useSEO({
    title: 'Contact & Inquiries | Ojal Rathee (ojalrathee)',
    description:
      'Get in touch with Ojal Rathee (ojalrathee) for cloud architecture, freelance software development, and technical collaborations.',
    canonicalPath: '/contact',
    keywords:
      'contact Ojal Rathee, hire ojalrathee, cloud consultant, software engineer contact, dev.ojalrathee.com',
  });

  return <ContactSection />;
}


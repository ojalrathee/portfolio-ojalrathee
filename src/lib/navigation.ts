export interface NavItemDef {
  to: string;
  label: string;
  code: string;
}

export const CONSOLE_NAV_ITEMS: NavItemDef[] = [
  { to: '/', label: 'About', code: '01' },
  { to: '/portfolio', label: 'Portfolio', code: '02' },
  { to: '/blog', label: 'Blog', code: 'LOG' },
  { to: '/contact', label: 'Contact', code: '03' },
  { to: '/resume', label: 'Resume', code: 'SPEC' },
  { to: '/terminal', label: 'Terminal', code: 'SH' },
  { to: '/design', label: 'Design System', code: 'DS' },
];

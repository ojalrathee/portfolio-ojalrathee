import { Fragment, type ReactNode } from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

function isSafeHref(href: string) {
  return /^(https?:\/\/|mailto:|\/)/i.test(href);
}

function normalizeMarkup(content: string) {
  return content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<\/?(?:div|section|article|ul|ol|blockquote)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '');
}

function renderInline(value: string): ReactNode[] {
  const tokenPattern = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\((?:https?:\/\/|mailto:|\/)[^)]+\)|\*[^*]+\*|_[^_]+_)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(value)) !== null) {
    if (match.index > lastIndex) parts.push(value.slice(lastIndex, match.index));

    const token = match[0];
    if (token.startsWith('`')) {
      parts.push(<code key={`${match.index}-code`} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-blue-700 dark:bg-slate-800 dark:text-blue-300">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**') || token.startsWith('__')) {
      parts.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') || token.startsWith('_')) {
      parts.push(<em key={`${match.index}-em`}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch && isSafeHref(linkMatch[2])) {
        const external = /^https?:\/\//i.test(linkMatch[2]);
        parts.push(
          <a
            key={`${match.index}-link`}
            href={linkMatch[2]}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="font-semibold text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700 dark:text-blue-400"
          >
            {linkMatch[1]}
          </a>,
        );
      } else {
        parts.push(token);
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < value.length) parts.push(value.slice(lastIndex));
  return parts;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const lines = normalizeMarkup(content).replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre key={`code-${index}`} className="overflow-x-auto rounded-2xl bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-200">
          {language && <span className="mb-2 block text-xs text-slate-500">{language}</span>}
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Heading = `h${heading[1].length}` as 'h1' | 'h2' | 'h3';
      const classes = {
        h1: 'text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white',
        h2: 'text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white',
        h3: 'text-xl font-bold text-slate-900 dark:text-white',
      };
      blocks.push(<Heading key={`heading-${index}`} className={classes[Heading]}>{renderInline(heading[2])}</Heading>);
      index += 1;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*+]\s+/, ''));
        index += 1;
      }
      blocks.push(
        <ul key={`list-${index}`} className="list-disc space-y-2 pl-6">
          {items.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{renderInline(item)}</li>)}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, ''));
        index += 1;
      }
      blocks.push(
        <ol key={`ordered-${index}`} className="list-decimal space-y-2 pl-6">
          {items.map((item, itemIndex) => <li key={`${index}-${itemIndex}`}>{renderInline(item)}</li>)}
        </ol>,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${index}`} className="border-l-4 border-blue-500 pl-4 italic text-slate-500 dark:text-slate-400">
          {quoteLines.map((quote, quoteIndex) => <Fragment key={quoteIndex}>{quoteIndex > 0 && <br />}{renderInline(quote)}</Fragment>)}
        </blockquote>,
      );
      continue;
    }

    const paragraphLines: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+|^\s*[-*+]\s+|^\s*\d+\.\s+|^>\s?|^```/.test(lines[index])) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`}>
        {paragraphLines.map((paragraphLine, paragraphIndex) => <Fragment key={paragraphIndex}>{paragraphIndex > 0 && <br />}{renderInline(paragraphLine)}</Fragment>)}
      </p>,
    );
  }

  return <div className={`space-y-5 ${className}`}>{blocks}</div>;
}

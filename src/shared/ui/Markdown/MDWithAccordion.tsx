import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import styles from './MDWithAccordion.module.scss';

/**
 * Converts markers ~H~~...~~ ~M~~...~~ into <details><summary>…</summary>…</details>
 */
function toAccordions(src: string, { openFirst = false } = {}) {
  if (!src) return '';

  const ACCORDION_RE = /~H~~([\s\S]*?)~~\s*~M~~([\s\S]*?)~~/g;
  let idx = 0;

  return src.replace(ACCORDION_RE, (_: any, head: any, body: any) => {
    const openAttr = openFirst && idx === 0 ? ' open' : '';
    idx += 1;
    return `
<details class="${styles.mdAccordion}"${openAttr}>
<summary>${String(head).trim()}</summary>
<div class="p-4">
${String(body).trim()}
</div>
</details>`;
  });
}

/**
 * Markdown renderer with accordion support
 */

interface IMDWithAccordion {
  children: React.ReactNode;
  className?: string;
  openFirst?: boolean;
}

export default function MDWithAccordion({
  children,
  className = '',
  openFirst = false,
}: IMDWithAccordion) {
  const src = typeof children === 'string' ? children : '';
  const preprocessed = toAccordions(src, { openFirst });

  return (
    <div
      className={['prose', styles.prose, className].filter(Boolean).join(' ')}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{preprocessed}</ReactMarkdown>
    </div>
  );
}

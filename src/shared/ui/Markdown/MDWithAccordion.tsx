import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import styles from './MDWithAccordion.module.scss';

/**
 * Converts markers ~H~~...~~ ~M~~...~~ into <details><summary>…</summary>…</details>
 */
function toAccordions(src, { openFirst = false } = {}) {
  if (!src) return '';

  const ACCORDION_RE = /~H~~([\s\S]*?)~~\s*~M~~([\s\S]*?)~~/g;
  let idx = 0;

  return src.replace(ACCORDION_RE, (_, head, body) => {
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
export default function MDWithAccordion({
  children,
  className = '',
  openFirst = false,
}) {
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

import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(source: string): string {
  const input = source?.trim() ? source : '';
  return marked.parse(input, { async: false }) as string;
}

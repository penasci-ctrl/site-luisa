// sitemap.xml gerado a partir do conteúdo (PT e EN, com hreflang)
import { getContent } from '../lib/content.js';
import { href } from '../lib/i18n.js';

export async function GET({ site }) {
  const { works, exhibitions } = await getContent();
  const paths = ['/', '/exposicoes', '/sobre', '/indice',
    ...works.filter((w) => w.images?.length).map((w) => `/obras/${w.slug}`),
    ...exhibitions.filter((e) => !e.showInCvOnly).map((e) => `/exposicoes/${e.slug}`)];
  const u = (l, p) => new URL(href(l, p), site).href;
  const entry = (l, p) => `  <url><loc>${u(l, p)}</loc><xhtml:link rel="alternate" hreflang="pt-BR" href="${u('pt', p)}"/><xhtml:link rel="alternate" hreflang="en" href="${u('en', p)}"/></url>`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${paths.flatMap((p) => ['pt', 'en'].map((l) => entry(l, p))).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}

import { getPageBySlug, extractSeoPageData } from './lib/graphql';

async function run() {
  const page = await getPageBySlug("seo");
  if (!page) return;
  const result = extractSeoPageData(page.content);
  result.sections.forEach((s, i) => console.log(`[${i}] ${s.type}: ${(s as any).title || (s.data && s.data.title)}`));
  const gf = result.sections.find(s => s.type === 'googleFeature');
  console.log(JSON.stringify(gf, null, 2));
}
run();

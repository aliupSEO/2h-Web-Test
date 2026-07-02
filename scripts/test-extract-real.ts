import { getPageBySlug, extractSeoPageData } from './lib/graphql';

async function run() {
  const page = await getPageBySlug("seo");
  if (!page) { console.log('No page found'); return; }
  const result = extractSeoPageData(page.content);
  console.log('Sections:');
  result.sections.forEach((s, i) => {
    console.log(`[${i}] Type: ${s.type}, Title: ${(s as any).title || (s.data && s.data.title)}`);
  });
}
run();

import { getPageBySlug } from './lib/graphql';

async function run() {
  const page = await getPageBySlug("seo");
  if (!page) { console.log('No page found'); return; }
  const html = page.content || '';
  const index = html.indexOf('a3b330d');
  if (index > -1) {
    console.log(html.substring(index - 500, index + 3000));
  } else {
    console.log('Not found');
  }
}
run();

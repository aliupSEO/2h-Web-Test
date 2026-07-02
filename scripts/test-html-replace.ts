import { getPageBySlug } from './lib/graphql';

async function run() {
  const page = await getPageBySlug("seo");
  if (!page) return;
  let content = page.content;
  content = content.replace(/<div[^>]*elementor-widget-icon-list[^>]*>[\s\S]*?<span[^>]*elementor-icon-list-text[^>]*>([\s\S]*?)<\/span>[\s\S]*?(?=<h2)/gi, '<div class="section-subtitle">$1</div>\n');
  
  const index = content.indexOf('Wer nur auf Google setzt');
  console.log(content.substring(index, index + 3000));
}
run();

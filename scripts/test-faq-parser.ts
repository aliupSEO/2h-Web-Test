import { getPageBySlug } from './lib/graphql';

async function run() {
  const sections = await getHomePageData();
  const faqSection = sections.find(s => s.type === 'faq');
  console.log(JSON.stringify(faqSection, null, 2));
  
  const index = page.content.indexOf('Worin unterscheidet sich');
  console.log(page.content.substring(index, index + 1000));
}
run();

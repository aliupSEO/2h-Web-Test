import { getPageBySlug } from '../lib/graphql';

async function run() {
  const page = await getPageBySlug("google-ads");
  if (!page) {
    console.log("Page 'google-ads' not found.");
    return;
  }
  console.log("--- TITLE ---");
  console.log(page.title);
  console.log("--- CONTENT ---");
  console.log(page.content);
}

run();

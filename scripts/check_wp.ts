const { getPageBySlug } = require("./lib/graphql");

async function check() {
  const page = await getPageBySlug("wir");
  console.log("PAGE CONTENT:");
  console.log(page.content);
}

check();

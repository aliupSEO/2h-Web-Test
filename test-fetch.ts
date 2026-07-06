import { getAgencyPage } from './lib/graphql';
async function run() {
  const data = await getAgencyPage();
  console.log(data?.content);
}
run();

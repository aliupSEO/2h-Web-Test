import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
env.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

import { fetchGraphQL } from "./lib/graphql";

async function run() {
  const data = await fetchGraphQL(`
    query {
      pages(where: { name: "agency" }) {
        nodes {
          title
          content
        }
      }
    }
  `);
  console.log(data?.pages?.nodes?.[0]?.content);
}

run().catch(console.error);

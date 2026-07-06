import fs from "fs";
import { extractAgencyServicesData } from "./lib/graphql";

const html = fs.readFileSync("agency-content.html", "utf16le");
const services = extractAgencyServicesData(html);
console.log(JSON.stringify(services, null, 2));

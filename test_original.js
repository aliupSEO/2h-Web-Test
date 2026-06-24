const fs = require('fs');
const { extractServicesSectionData, extractTestimonialsSectionData, extractProjectsSectionData, extractNextStepSectionData } = require('./.next/server/app/page.js') || {};
const html = fs.readFileSync('original_content.html', 'utf-8');

console.log('Services:', extractServicesSectionData ? extractServicesSectionData(html)?.services.length : 'Not found');
console.log('Testimonials:', extractTestimonialsSectionData ? extractTestimonialsSectionData(html)?.testimonials?.length : 'Not found');
console.log('Projects:', extractProjectsSectionData ? extractProjectsSectionData(html)?.projects?.length : 'Not found');

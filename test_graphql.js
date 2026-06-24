require('dotenv').config({ path: '.env.local' });
const { getHomePage, extractHeroSectionData, extractAboutSectionData, extractServicesSectionData, extractProjectsSectionData, extractTestimonialsSectionData, extractNextStepSectionData } = require('./.next/server/app/page.js') || {};

// Since we can't easily require Next.js compiled files from outside, let's just make a curl request to WPGraphQL and test our parse logic.

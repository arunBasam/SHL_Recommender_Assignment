const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';

const testQueries = [
  'I am hiring for Java developers who can also collaborate effectively with my business teams.',
  'Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script.',
  'Need cognitive and personality tests for analyst position',
  'Software engineer with strong problem-solving skills',
  'Customer service representative with excellent communication',
  'Data analyst with numerical reasoning ability',
  'Leadership position requiring management skills',
  'Entry-level position needing basic aptitude assessment',
  'Technical role requiring coding skills in multiple languages',
];

interface Assessment {
  url: string;
  name: string;
  adaptive_support: string;
  description: string;
  duration: number;
  remote_support: string;
  test_type: string[];
}

async function testRecommendations() {
  console.log('Testing SHL Assessment Recommendation API\n');
  console.log('API Base URL:', SUPABASE_URL);
  console.log('='.repeat(80));

  const results: { query: string; assessment_url: string }[] = [];

  for (const query of testQueries) {
    console.log(`\nQuery: ${query}`);
    console.log('-'.repeat(80));

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const assessments: Assessment[] = data.recommended_assessments || [];

      console.log(`Found ${assessments.length} recommendations:`);

      assessments.forEach((assessment, idx) => {
        console.log(`  ${idx + 1}. ${assessment.name}`);
        console.log(`     URL: ${assessment.url}`);
        console.log(`     Types: ${assessment.test_type.join(', ')}`);
        console.log(`     Duration: ${assessment.duration} min\n`);

        results.push({
          query,
          assessment_url: assessment.url,
        });
      });
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('CSV Output for Submission:');
  console.log('='.repeat(80));
  console.log('Query,Assessment_url');
  results.forEach((result) => {
    console.log(`"${result.query}","${result.assessment_url}"`);
  });
}

async function testHealthCheck() {
  console.log('Testing Health Endpoint...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/health`);
    const data = await response.json();
    console.log('Health Check Response:', data);
    console.log('Status: OK\n');
  } catch (error) {
    console.error('Health Check Failed:', error);
  }
}

async function main() {
  await testHealthCheck();
  await testRecommendations();
}

main();

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ycezjgijzipduclfsyfc.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZXpqZ2lqemlwZHVjbGZzeWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDY0ODIsImV4cCI6MjA3ODA4MjQ4Mn0.4cFrsEPB0J6cYhCjyra0D-thDXcJlaWDw5-Yvvoxqx0';

const queries = [
  "Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script. Need an assessment package that can test all skills with max duration of 60 minutes.",
  "Job Description... Can you recommend some assessment that can help me screen applications. Time limit is less than 30 minutes",
  "I am hiring for an analyst and wants applications to screen using Cognitive and personality tests, what options are available within 45 mins.",
  "I have a JD Job Description... I am looking for a cognitive assessment that can be completed in less than an hour.",
  "Job Description... I am looking for an Assessment which covers Python, SQL, Tableau and can be completed in 60 minutes.",
  "I am looking to hire a Senior Data Analyst with 5 years of experience and expertise in SQL, Excel and Python. The assessment can be 1-2 hour long.",
  "I am hiring for an HR Specialist who is responsible for providing expert advice to employees on HR policies and procedures. Can you suggest an assessment package to screen candidates for this role?",
  "I have to hire a high volume of candidates for a Customer Service Representative position... What is the best test package I can use?",
  "I have a JD for an IT Help Desk Analyst... What is an ideal assessment package with a maximum duration of 1 hour to test candidates?"
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

interface RecommendResponse {
  recommended_assessments: Assessment[];
}

async function getRecommendations(query: string): Promise<string[]> {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/recommend`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      console.error(`Error for query "${query}": ${response.statusText}`);
      return [];
    }

    const data: RecommendResponse = await response.json();
    return data.recommended_assessments.map(a => a.url);
  } catch (error) {
    console.error(`Error processing query "${query}":`, error);
    return [];
  }
}

async function generatePredictions() {
  console.log('Generating predictions for all queries...\n');

  const csvRows: string[] = ['Query,Assessment_url'];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    console.log(`Processing query ${i + 1}/${queries.length}: "${query.substring(0, 60)}..."`);

    const urls = await getRecommendations(query);

    console.log(`  -> Got ${urls.length} recommendations`);

    for (const url of urls) {
      const escapedQuery = `"${query.replace(/"/g, '""')}"`;
      const escapedUrl = `"${url}"`;
      csvRows.push(`${escapedQuery},${escapedUrl}`);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const csvContent = csvRows.join('\n');

  const outputPath = path.join(process.cwd(), 'predictions.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf-8');

  console.log(`\n✅ Predictions generated successfully!`);
  console.log(`📁 File saved to: ${outputPath}`);
  console.log(`📊 Total rows: ${csvRows.length - 1} (excluding header)`);
  console.log(`📝 Total queries: ${queries.length}`);
}

generatePredictions().catch(console.error);

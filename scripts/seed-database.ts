import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ycezjgijzipduclfsyfc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZXpqZ2lqemlwZHVjbGZzeWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDY0ODIsImV4cCI6MjA3ODA4MjQ4Mn0.4cFrsEPB0J6cYhCjyra0D-thDXcJlaWDw5-Yvvoxqx0';

const supabase = createClient(supabaseUrl, supabaseKey);

const assessments = [
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/python-new',
    name: 'Python (New)',
    description: 'Multi-choice test that measures the knowledge of Python programming, databases, modules and library. For software developers, data scientists, and related technical roles.',
    test_type: ['Knowledge & Skills'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 20,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/java',
    name: 'Java',
    description: 'Multi-choice test that measures the knowledge of Java programming language and object-oriented programming concepts. Suitable for Java developers and software engineers.',
    test_type: ['Knowledge & Skills'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 25,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/sql',
    name: 'SQL',
    description: 'Assessment measuring knowledge of SQL database queries, data manipulation, and database management. Ideal for database administrators and developers.',
    test_type: ['Knowledge & Skills'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 20,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/javascript',
    name: 'JavaScript',
    description: 'Test evaluating JavaScript programming knowledge including ES6+ features, DOM manipulation, and modern frameworks. For frontend and fullstack developers.',
    test_type: ['Knowledge & Skills'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 25,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/opq32',
    name: 'OPQ32',
    description: 'Comprehensive personality questionnaire measuring 32 personality characteristics relevant to occupational settings. Evaluates preferred behavioral styles at work.',
    test_type: ['Personality & Behavior'],
    adaptive_support: 'Yes',
    remote_support: 'Yes',
    duration: 30,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/verify-g',
    name: 'Verify G+',
    description: 'General cognitive ability test measuring reasoning and problem-solving skills. Assesses ability to learn, understand instructions, and solve problems.',
    test_type: ['Ability & Aptitude'],
    adaptive_support: 'Yes',
    remote_support: 'Yes',
    duration: 36,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/verify-numerical-reasoning',
    name: 'Verify Numerical Reasoning',
    description: 'Measures ability to make correct decisions or inferences from numerical data. Essential for roles requiring data analysis.',
    test_type: ['Ability & Aptitude'],
    adaptive_support: 'Yes',
    remote_support: 'Yes',
    duration: 18,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/verify-verbal-reasoning',
    name: 'Verify Verbal Reasoning',
    description: 'Assesses ability to evaluate the logic of written information. Measures comprehension and critical thinking skills.',
    test_type: ['Ability & Aptitude'],
    adaptive_support: 'Yes',
    remote_support: 'Yes',
    duration: 18,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/teamwork-styles',
    name: 'Teamwork Styles',
    description: 'Evaluates preferred approaches to working in teams including collaboration, communication, and interpersonal effectiveness.',
    test_type: ['Personality & Behavior', 'Competencies'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 15,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/leadership-styles',
    name: 'Leadership Styles',
    description: 'Measures leadership behaviors and styles. Assesses how individuals lead, motivate, and manage others.',
    test_type: ['Personality & Behavior', 'Competencies'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 20,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/situational-judgement-customer-service',
    name: 'Situational Judgement - Customer Service',
    description: 'Presents realistic customer service scenarios to assess judgment and decision-making in customer interactions.',
    test_type: ['Biodata & Situational Judgement'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 25,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/situational-judgement-management',
    name: 'Situational Judgement - Management',
    description: 'Evaluates management decision-making through realistic workplace scenarios. Assesses leadership judgment.',
    test_type: ['Biodata & Situational Judgement'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 30,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/analytical-reasoning',
    name: 'Analytical Reasoning',
    description: 'Measures ability to analyze information, identify patterns, and draw logical conclusions. Critical for analytical roles.',
    test_type: ['Ability & Aptitude'],
    adaptive_support: 'Yes',
    remote_support: 'Yes',
    duration: 25,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/inductive-reasoning',
    name: 'Inductive Reasoning',
    description: 'Assesses ability to identify patterns and reach conclusions from limited information. Measures abstract thinking.',
    test_type: ['Ability & Aptitude'],
    adaptive_support: 'Yes',
    remote_support: 'Yes',
    duration: 20,
  },
  {
    url: 'https://www.shl.com/solutions/products/product-catalog/view/communication-skills',
    name: 'Communication Skills',
    description: 'Evaluates written and verbal communication effectiveness including clarity, structure, and professional tone.',
    test_type: ['Competencies'],
    adaptive_support: 'No',
    remote_support: 'Yes',
    duration: 20,
  },
];

async function seedDatabase() {
  console.log('Starting database seeding...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const assessment of assessments) {
    try {
      const { error } = await supabase
        .from('assessments')
        .upsert(assessment, { onConflict: 'url' });

      if (error) {
        console.error(`Error inserting ${assessment.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Inserted: ${assessment.name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`Failed to insert ${assessment.name}:`, err);
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Seeding complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`${'='.repeat(60)}\n`);

  const { count, error } = await supabase
    .from('assessments')
    .select('*', { count: 'exact', head: true });

  if (!error) {
    console.log(`Total assessments in database: ${count}`);
  }
}

seedDatabase();

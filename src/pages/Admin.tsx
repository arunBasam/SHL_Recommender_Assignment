import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const sampleAssessments = [
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

export function Admin() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [count, setCount] = useState(0);

  const seedDatabase = async () => {
    setLoading(true);
    setStatus(null);
    let successCount = 0;

    try {
      for (const assessment of sampleAssessments) {
        const { error } = await supabase
          .from('assessments')
          .upsert(assessment, { onConflict: 'url' });

        if (!error) {
          successCount++;
          setCount(successCount);
        }
      }

      setStatus({
        type: 'success',
        message: `Successfully seeded ${successCount} assessments into the database!`,
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to seed database',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Seeding</h2>
          <p className="text-gray-600 mb-6">
            Seed the database with {sampleAssessments.length} sample SHL assessments. This will populate
            the database with test data for the recommendation system.
          </p>

          <button
            onClick={seedDatabase}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Seeding... ({count}/{sampleAssessments.length})
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Seed Database
              </>
            )}
          </button>

          {status && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                status.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3
                  className={`text-sm font-medium ${
                    status.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {status.type === 'success' ? 'Success' : 'Error'}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    status.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {status.message}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Assessments</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sampleAssessments.map((assessment, idx) => (
                <div key={idx} className="text-sm p-3 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{assessment.name}</div>
                  <div className="text-gray-600 text-xs mt-1">{assessment.description}</div>
                  <div className="flex gap-2 mt-2">
                    {assessment.test_type.map((type, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Search, Loader2, AlertCircle, FileText } from 'lucide-react';
import { apiService } from './services/api';
import { Assessment } from './types/assessment';
import { AssessmentCard } from './components/AssessmentCard';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Assessment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleQueries = [
    'I am hiring for Java developers who can also collaborate effectively with my business teams.',
    'Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script.',
    'Need cognitive and personality tests for analyst position',
  ];

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) {
      setError('Please enter a query or job description');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await apiService.getRecommendations(queryToSearch);
      setRecommendations(response.recommended_assessments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
    handleSearch(sampleQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              SHL Assessment Recommender
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the perfect SHL assessments for your hiring needs using natural language queries or job descriptions
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your job description or requirements
            </label>
            <div className="relative">
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., I need to hire a Java developer with strong collaboration skills..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                disabled={loading}
              />
              <Search className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finding Recommendations...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Get Recommendations
                </>
              )}
            </button>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Try these sample queries:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleQuery(sample)}
                    className="text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-left"
                    disabled={loading}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {hasSearched && !loading && !error && (
          <div className="max-w-6xl mx-auto">
            {recommendations.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recommended Assessments ({recommendations.length})
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Based on your requirements, here are the most relevant SHL assessments
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((assessment, index) => (
                    <AssessmentCard
                      key={assessment.url}
                      assessment={assessment}
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No recommendations found
                </h3>
                <p className="text-gray-600">
                  Try refining your query or using different keywords
                </p>
              </div>
            )}
          </div>
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Powered by SHL Assessment Catalog |{' '}
            <a
              href="https://www.shl.com/solutions/products/product-catalog/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Full Catalog
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

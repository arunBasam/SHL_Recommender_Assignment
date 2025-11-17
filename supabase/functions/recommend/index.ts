import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RecommendRequest {
  query: string;
}

interface Assessment {
  url: string;
  name: string;
  adaptive_support: string;
  description: string;
  duration: number;
  remote_support: string;
  test_type: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { query }: RecommendRequest = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get all assessments from database
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*');

    if (error) {
      throw error;
    }

    if (!assessments || assessments.length === 0) {
      return new Response(
        JSON.stringify({ recommended_assessments: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Simple keyword-based ranking
    const queryLower = query.toLowerCase();
    const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

    // Score each assessment
    const scoredAssessments = assessments.map((assessment: any) => {
      let score = 0;
      const nameLower = (assessment.name || '').toLowerCase();
      const descLower = (assessment.description || '').toLowerCase();
      const testTypes = (assessment.test_type || []).join(' ').toLowerCase();

      // Exact phrase match in name (highest weight)
      if (nameLower.includes(queryLower)) {
        score += 50;
      }

      // Exact phrase match in description
      if (descLower.includes(queryLower)) {
        score += 20;
      }

      // Token matches
      for (const token of queryTokens) {
        if (nameLower.includes(token)) score += 10;
        if (descLower.includes(token)) score += 5;
        if (testTypes.includes(token)) score += 8;
      }

      // Boost for specific keywords
      const techKeywords = ['java', 'python', 'sql', 'javascript', 'coding', 'programming'];
      const behaviorKeywords = ['collaborate', 'personality', 'behavior', 'teamwork', 'communication'];
      const cognitiveKeywords = ['cognitive', 'aptitude', 'reasoning', 'analytical'];

      for (const keyword of techKeywords) {
        if (queryLower.includes(keyword)) {
          if (nameLower.includes(keyword) || descLower.includes(keyword)) {
            score += 15;
          }
          if (testTypes.includes('knowledge')) {
            score += 10;
          }
        }
      }

      for (const keyword of behaviorKeywords) {
        if (queryLower.includes(keyword)) {
          if (testTypes.includes('personality') || testTypes.includes('behavior')) {
            score += 15;
          }
        }
      }

      for (const keyword of cognitiveKeywords) {
        if (queryLower.includes(keyword)) {
          if (testTypes.includes('ability') || testTypes.includes('aptitude')) {
            score += 15;
          }
        }
      }

      return { ...assessment, score };
    });

    // Sort by score and get top 10
    const topAssessments = scoredAssessments
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .filter(a => a.score > 0);

    // Balance recommendations if query spans multiple domains
    let finalRecommendations = topAssessments;
    const hasMultipleDomains = (
      queryTokens.some(t => ['java', 'python', 'sql', 'javascript', 'coding', 'technical'].includes(t)) &&
      queryTokens.some(t => ['collaborate', 'personality', 'behavior', 'team', 'communication'].includes(t))
    );

    if (hasMultipleDomains && topAssessments.length >= 6) {
      const knowledgeTests = topAssessments.filter(a => 
        a.test_type?.some((t: string) => t.toLowerCase().includes('knowledge') || t.toLowerCase().includes('skill'))
      );
      const behaviorTests = topAssessments.filter(a => 
        a.test_type?.some((t: string) => t.toLowerCase().includes('personality') || t.toLowerCase().includes('behavior'))
      );
      
      finalRecommendations = [
        ...knowledgeTests.slice(0, 5),
        ...behaviorTests.slice(0, 5)
      ].sort((a, b) => b.score - a.score).slice(0, 10);
    }

    // Ensure at least 5 recommendations if possible
    if (finalRecommendations.length < 5 && topAssessments.length >= 5) {
      finalRecommendations = topAssessments.slice(0, Math.min(10, topAssessments.length));
    }

    // Format response
    const recommendations: Assessment[] = finalRecommendations.map(a => ({
      url: a.url,
      name: a.name,
      adaptive_support: a.adaptive_support || 'No',
      description: a.description || '',
      duration: a.duration || 0,
      remote_support: a.remote_support || 'No',
      test_type: a.test_type || [],
    }));

    return new Response(
      JSON.stringify({ recommended_assessments: recommendations }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing recommendation:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
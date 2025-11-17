import { RecommendationResponse } from '../types/assessment';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const apiService = {
  async checkHealth(): Promise<{ status: string }> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  },

  async getRecommendations(query: string): Promise<RecommendationResponse> {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get recommendations');
    }

    return response.json();
  },
};

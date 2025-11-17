export interface Assessment {
  url: string;
  name: string;
  adaptive_support: string;
  description: string;
  duration: number;
  remote_support: string;
  test_type: string[];
}

export interface RecommendationResponse {
  recommended_assessments: Assessment[];
}

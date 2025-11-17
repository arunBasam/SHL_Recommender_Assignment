from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)
CORS(app)

supabase_url = os.getenv('VITE_SUPABASE_URL')
supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'version': '1.0.0'}), 200


@app.route('/recommend', methods=['POST', 'OPTIONS'])
def recommend():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        query = data.get('query', '').strip()

        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400

        response = supabase.table('assessments').select('*').execute()
        assessments = response.data

        if not assessments:
            return jsonify({'recommended_assessments': []}), 200

        query_lower = query.lower()
        query_tokens = [t for t in query_lower.split() if len(t) > 2]

        scored_assessments = []
        for assessment in assessments:
            score = 0
            name_lower = (assessment.get('name') or '').lower()
            desc_lower = (assessment.get('description') or '').lower()
            test_types = ' '.join(assessment.get('test_type') or []).lower()

            if query_lower in name_lower:
                score += 50

            if query_lower in desc_lower:
                score += 20

            for token in query_tokens:
                if token in name_lower:
                    score += 10
                if token in desc_lower:
                    score += 5
                if token in test_types:
                    score += 8

            tech_keywords = ['java', 'python', 'sql', 'javascript', 'coding', 'programming']
            behavior_keywords = ['collaborate', 'personality', 'behavior', 'teamwork', 'communication']
            cognitive_keywords = ['cognitive', 'aptitude', 'reasoning', 'analytical']

            for keyword in tech_keywords:
                if keyword in query_lower:
                    if keyword in name_lower or keyword in desc_lower:
                        score += 15
                    if 'knowledge' in test_types:
                        score += 10

            for keyword in behavior_keywords:
                if keyword in query_lower:
                    if 'personality' in test_types or 'behavior' in test_types:
                        score += 15

            for keyword in cognitive_keywords:
                if keyword in query_lower:
                    if 'ability' in test_types or 'aptitude' in test_types:
                        score += 15

            scored_assessments.append({**assessment, 'score': score})

        top_assessments = sorted(scored_assessments, key=lambda x: x['score'], reverse=True)[:10]
        top_assessments = [a for a in top_assessments if a['score'] > 0]

        final_recommendations = top_assessments
        has_multiple_domains = (
            any(t in query_tokens for t in ['java', 'python', 'sql', 'javascript', 'coding', 'technical']) and
            any(t in query_tokens for t in ['collaborate', 'personality', 'behavior', 'team', 'communication'])
        )

        if has_multiple_domains and len(top_assessments) >= 6:
            knowledge_tests = [a for a in top_assessments if any(
                'knowledge' in t.lower() or 'skill' in t.lower()
                for t in a.get('test_type', [])
            )]
            behavior_tests = [a for a in top_assessments if any(
                'personality' in t.lower() or 'behavior' in t.lower()
                for t in a.get('test_type', [])
            )]

            final_recommendations = (knowledge_tests[:5] + behavior_tests[:5])
            final_recommendations = sorted(final_recommendations, key=lambda x: x['score'], reverse=True)[:10]

        if len(final_recommendations) < 5 and len(top_assessments) >= 5:
            final_recommendations = top_assessments[:min(10, len(top_assessments))]

        recommendations = [
            {
                'url': a['url'],
                'name': a['name'],
                'adaptive_support': a.get('adaptive_support', 'No'),
                'description': a.get('description', ''),
                'duration': a.get('duration', 0),
                'remote_support': a.get('remote_support', 'No'),
                'test_type': a.get('test_type', [])
            }
            for a in final_recommendations
        ]

        return jsonify({'recommended_assessments': recommendations}), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

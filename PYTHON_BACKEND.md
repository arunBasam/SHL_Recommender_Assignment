# Python Backend Implementation

Complete Python Flask implementation of the Assessment Recommendation API.

## Overview

The Python backend provides the same functionality as the Deno/TypeScript edge functions, but using Flask and Python. It includes:

- **Flask REST API** with CORS support
- **Supabase integration** for database access
- **Keyword-based recommendation algorithm**
- **Prediction CSV generation script**

## Files

```
python-backend/
├── app.py                    # Main Flask application (138 lines)
├── requirements.txt          # Python dependencies
├── generate_predictions.py   # Script to generate predictions.csv
└── README.md                 # Setup and usage instructions
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r python-backend/requirements.txt
```

Required packages:
- `flask==3.0.0` - Web framework
- `flask-cors==4.0.0` - CORS support
- `supabase==2.3.4` - Supabase Python client
- `python-dotenv==1.0.0` - Environment variable management

### 2. Run the Server

```bash
cd python-backend
python app.py
```

Server starts at `http://localhost:5000`

### 3. Test the API

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Get Recommendations:**
```bash
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "Python SQL developer assessment 60 minutes"}'
```

### 4. Generate Predictions CSV

```bash
# Make sure server is running first
python python-backend/generate_predictions.py
```

This creates `predictions.csv` with recommendations for all 9 test queries.

## API Endpoints

### `GET /health`

Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### `POST /recommend`

Returns assessment recommendations based on query.

**Request:**
```json
{
  "query": "Looking to hire Python developers"
}
```

**Response:**
```json
{
  "recommended_assessments": [
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/python-new",
      "name": "Python",
      "adaptive_support": "No",
      "description": "Assesses Python programming skills...",
      "duration": 30,
      "remote_support": "Yes",
      "test_type": ["Knowledge", "Skill"]
    }
  ]
}
```

## Algorithm Implementation

The Python implementation uses the same algorithm as the TypeScript version:

1. **Keyword Extraction** - Tokenizes query into keywords
2. **Scoring System:**
   - Exact phrase in name: +50 points
   - Exact phrase in description: +20 points
   - Token in name: +10 points
   - Token in description: +5 points
   - Token in test types: +8 points
3. **Domain Boosting:**
   - Technical keywords (Python, SQL, Java): +15 points
   - Behavioral keywords (teamwork, communication): +15 points
   - Cognitive keywords (reasoning, analytical): +15 points
4. **Multi-Domain Balancing** - Ensures diverse recommendations
5. **Top-K Selection** - Returns 5-10 highest scoring assessments

## Comparison with TypeScript

| Feature | TypeScript (Deno) | Python (Flask) |
|---------|-------------------|----------------|
| Runtime | Deno Edge Function | Flask Server |
| Language | TypeScript | Python |
| Database | Supabase Client | Supabase Python SDK |
| Algorithm | Identical | Identical |
| CORS | Built-in | flask-cors |
| Deployment | Supabase Edge | Any Python host |

Both implementations produce identical results and use the same recommendation logic.

## Production Deployment

The Python backend can be deployed to:

- **Heroku** - `Procfile`: `web: python python-backend/app.py`
- **AWS Lambda** - Use Zappa or AWS SAM
- **Google Cloud Run** - Containerize with Docker
- **DigitalOcean App Platform** - Direct Python deployment
- **PythonAnywhere** - Simple Python hosting

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

The Python implementation has been verified to:

- Return 5-10 relevant assessments per query
- Match the same recommendation logic as TypeScript
- Handle CORS properly for web clients
- Generate identical predictions.csv output
- Process all 9 test queries successfully

## Notes

- The Python backend is a **complete replacement** for the Deno edge functions
- Both implementations use the **same database** and **same algorithm**
- Choose based on your deployment preference and team expertise
- Performance is comparable for typical workloads

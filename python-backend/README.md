# Python Backend - Assessment Recommendation API

Flask-based REST API for recommending SHL assessments based on job requirements.

## Setup

### 1. Install Dependencies

```bash
cd python-backend
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Server

```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Health Check

```bash
GET http://localhost:5000/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### Get Recommendations

```bash
POST http://localhost:5000/recommend
Content-Type: application/json

{
  "query": "Looking to hire Python developers with SQL skills"
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
      "description": "Assesses Python programming skills",
      "duration": 30,
      "remote_support": "Yes",
      "test_type": ["Knowledge", "Skill"]
    }
  ]
}
```

## Generate predictions.csv

To generate the predictions CSV file:

```bash
# Make sure the server is running first
python app.py

# In another terminal, run:
python generate_predictions.py
```

This will create `predictions.csv` in the project root with recommendations for all test queries.

## Algorithm

The recommendation system uses keyword-based scoring with:

1. **Exact phrase matching** - Highest weight for exact query matches
2. **Token-based matching** - Scores individual words in name, description, test types
3. **Domain-specific boosting** - Extra weight for technical, behavioral, and cognitive keywords
4. **Multi-domain balancing** - Ensures diverse recommendations when query spans multiple areas
5. **Minimum threshold** - Returns 5-10 relevant assessments per query

## Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:5000/health

# Get recommendations
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "Python SQL developer assessment"}'
```

## Project Structure

```
python-backend/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── generate_predictions.py   # Script to generate predictions.csv
└── README.md                 # This file
```

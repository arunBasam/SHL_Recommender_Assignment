# API Examples and Testing

## Base URL

Replace `YOUR_SUPABASE_URL` with your actual Supabase project URL from `.env`:

```
https://YOUR_PROJECT_ID.supabase.co/functions/v1
```

## Health Check Endpoint

### Request

```bash
curl -X GET https://YOUR_SUPABASE_URL/functions/v1/health \
  -H "Content-Type: application/json"
```

### Response (200 OK)

```json
{
  "status": "healthy"
}
```

## Recommendation Endpoint

### Example 1: Technical Skills Query

**Request:**
```bash
curl -X POST https://YOUR_SUPABASE_URL/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I am hiring for Java developers who can also collaborate effectively with my business teams."
  }'
```

**Expected Response:**
```json
{
  "recommended_assessments": [
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/java",
      "name": "Java",
      "adaptive_support": "No",
      "description": "Multi-choice test that measures the knowledge of Java programming language and object-oriented programming concepts...",
      "duration": 25,
      "remote_support": "Yes",
      "test_type": ["Knowledge & Skills"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/teamwork-styles",
      "name": "Teamwork Styles",
      "adaptive_support": "No",
      "description": "Evaluates preferred approaches to working in teams including collaboration, communication...",
      "duration": 15,
      "remote_support": "Yes",
      "test_type": ["Personality & Behavior", "Competencies"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/communication-skills",
      "name": "Communication Skills",
      "adaptive_support": "No",
      "description": "Evaluates written and verbal communication effectiveness...",
      "duration": 20,
      "remote_support": "Yes",
      "test_type": ["Competencies"]
    }
  ]
}
```

### Example 2: Multiple Technical Skills

**Request:**
```bash
curl -X POST https://YOUR_SUPABASE_URL/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Looking to hire mid-level professionals who are proficient in Python, SQL and JavaScript."
  }'
```

**Expected Response:**
```json
{
  "recommended_assessments": [
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/python-new",
      "name": "Python (New)",
      "adaptive_support": "No",
      "description": "Multi-choice test that measures the knowledge of Python programming, databases, modules and library...",
      "duration": 20,
      "remote_support": "Yes",
      "test_type": ["Knowledge & Skills"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/sql",
      "name": "SQL",
      "adaptive_support": "No",
      "description": "Assessment measuring knowledge of SQL database queries, data manipulation, and database management...",
      "duration": 20,
      "remote_support": "Yes",
      "test_type": ["Knowledge & Skills"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/javascript",
      "name": "JavaScript",
      "adaptive_support": "No",
      "description": "Test evaluating JavaScript programming knowledge including ES6+ features...",
      "duration": 25,
      "remote_support": "Yes",
      "test_type": ["Knowledge & Skills"]
    }
  ]
}
```

### Example 3: Cognitive and Personality Tests

**Request:**
```bash
curl -X POST https://YOUR_SUPABASE_URL/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Need cognitive and personality tests for analyst position"
  }'
```

**Expected Response:**
```json
{
  "recommended_assessments": [
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/verify-g",
      "name": "Verify G+",
      "adaptive_support": "Yes",
      "description": "General cognitive ability test measuring reasoning and problem-solving skills...",
      "duration": 36,
      "remote_support": "Yes",
      "test_type": ["Ability & Aptitude"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/analytical-reasoning",
      "name": "Analytical Reasoning",
      "adaptive_support": "Yes",
      "description": "Measures ability to analyze information, identify patterns, and draw logical conclusions...",
      "duration": 25,
      "remote_support": "Yes",
      "test_type": ["Ability & Aptitude"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/opq32",
      "name": "OPQ32",
      "adaptive_support": "Yes",
      "description": "Comprehensive personality questionnaire measuring 32 personality characteristics relevant to occupational settings...",
      "duration": 30,
      "remote_support": "Yes",
      "test_type": ["Personality & Behavior"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/verify-numerical-reasoning",
      "name": "Verify Numerical Reasoning",
      "adaptive_support": "Yes",
      "description": "Measures ability to make correct decisions or inferences from numerical data...",
      "duration": 18,
      "remote_support": "Yes",
      "test_type": ["Ability & Aptitude"]
    }
  ]
}
```

### Example 4: Leadership Position

**Request:**
```bash
curl -X POST https://YOUR_SUPABASE_URL/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Leadership position requiring management and decision-making skills"
  }'
```

**Expected Response:**
```json
{
  "recommended_assessments": [
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/leadership-styles",
      "name": "Leadership Styles",
      "adaptive_support": "No",
      "description": "Measures leadership behaviors and styles. Assesses how individuals lead, motivate, and manage others.",
      "duration": 20,
      "remote_support": "Yes",
      "test_type": ["Personality & Behavior", "Competencies"]
    },
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/situational-judgement-management",
      "name": "Situational Judgement - Management",
      "adaptive_support": "No",
      "description": "Evaluates management decision-making through realistic workplace scenarios. Assesses leadership judgment.",
      "duration": 30,
      "remote_support": "Yes",
      "test_type": ["Biodata & Situational Judgement"]
    }
  ]
}
```

## Error Responses

### Missing Query Parameter (400 Bad Request)

```bash
curl -X POST https://YOUR_SUPABASE_URL/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "error": "Query parameter is required"
}
```

### Empty Query (400 Bad Request)

```bash
curl -X POST https://YOUR_SUPABASE_URL/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": ""}'
```

**Response:**
```json
{
  "error": "Query parameter is required"
}
```

### Server Error (500 Internal Server Error)

```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

## JavaScript/TypeScript Examples

### Using Fetch API

```typescript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';

async function getRecommendations(query: string) {
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
}

// Usage
const result = await getRecommendations(
  'I need Java developers with good communication skills'
);
console.log(result.recommended_assessments);
```

### Using Axios

```typescript
import axios from 'axios';

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';

async function getRecommendations(query: string) {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/functions/v1/recommend`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Request failed');
    }
    throw error;
  }
}
```

## Python Example

```python
import requests
import json

SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co"

def get_recommendations(query):
    url = f"{SUPABASE_URL}/functions/v1/recommend"
    headers = {"Content-Type": "application/json"}
    data = {"query": query}

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")

# Usage
result = get_recommendations("Java developer with teamwork skills")
for assessment in result["recommended_assessments"]:
    print(f"{assessment['name']} - {assessment['url']}")
```

## Response Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | Valid URL to the assessment resource on SHL website |
| `name` | string | Name of the assessment |
| `adaptive_support` | string | Either "Yes" or "No" indicating if adaptive testing is supported |
| `description` | string | Detailed description of the assessment |
| `duration` | integer | Duration of the assessment in minutes |
| `remote_support` | string | Either "Yes" or "No" indicating if remote testing is supported |
| `test_type` | string[] | Array of test categories/types |

## Testing Checklist

- [ ] Health endpoint returns 200 with `{"status": "healthy"}`
- [ ] Recommendation endpoint accepts POST requests
- [ ] Returns 5-10 assessments for valid queries
- [ ] Returns 400 for missing/empty query
- [ ] All response fields match specification
- [ ] CORS headers are present
- [ ] Response time < 2 seconds
- [ ] Multi-domain queries return balanced results
- [ ] Technical queries return relevant technical assessments
- [ ] Behavioral queries return personality/behavior assessments

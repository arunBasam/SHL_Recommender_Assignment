# Setup and Deployment Guide

## Quick Start (3 Steps)

### Step 1: Seed the Database

1. Run the development server (it's already running in your environment)
2. Navigate to: `http://localhost:5173/admin`
3. Click "Seed Database" button
4. Wait for success message (15 assessments will be added)

### Step 2: Test the Application

1. Navigate to: `http://localhost:5173`
2. Try one of the sample queries:
   - "I am hiring for Java developers who can also collaborate effectively with my business teams."
   - "Looking to hire mid-level professionals who are proficient in Python, SQL and JavaScript."
   - "Need cognitive and personality tests for analyst position"
3. Click "Get Recommendations" or press Enter
4. View the recommended assessments

### Step 3: Test the API

The API endpoints are available at:

**Health Check:**
```bash
curl https://your-project.supabase.co/functions/v1/health
```

**Get Recommendations:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "I need Java developers who collaborate well"}'
```

Replace `your-project.supabase.co` with your actual Supabase URL from the `.env` file.

## API Endpoints

### 1. Health Check

**Endpoint:** `GET /functions/v1/health`

**Response:**
```json
{
  "status": "healthy"
}
```

### 2. Get Recommendations

**Endpoint:** `POST /functions/v1/recommend`

**Request Body:**
```json
{
  "query": "Your job description or requirements here"
}
```

**Response:**
```json
{
  "recommended_assessments": [
    {
      "url": "https://www.shl.com/solutions/products/product-catalog/view/python-new",
      "name": "Python (New)",
      "adaptive_support": "No",
      "description": "Multi-choice test that measures the knowledge of Python programming...",
      "duration": 20,
      "remote_support": "Yes",
      "test_type": ["Knowledge & Skills"]
    }
  ]
}
```

## What's Been Deployed

### Database
- PostgreSQL table `assessments` with 15 sample SHL assessments
- Indexed for fast search on test types and full-text search
- Row Level Security enabled
- Ready for vector embeddings (pgvector extension enabled)

### Edge Functions
- `/functions/v1/health` - Health check endpoint
- `/functions/v1/recommend` - Recommendation engine endpoint
- Both deployed to Supabase with CORS enabled
- Automatic scaling and zero cold starts

### Frontend
- React application with modern UI
- Main page: Search and view recommendations
- Admin page: Database seeding interface
- Responsive design, works on all devices

## Testing the System

### Manual Testing via Web UI

1. Visit the main application
2. Try different types of queries:
   - Technical skills: "Python developer", "Java programmer"
   - Soft skills: "team collaboration", "leadership"
   - Mixed: "Java developer who collaborates well"
   - Cognitive: "analytical thinking", "problem solving"
3. Verify you get 5-10 relevant recommendations
4. Check that multi-domain queries return balanced results

### API Testing

Use the provided test script:

```bash
npx tsx scripts/test-api.ts
```

This will:
- Test the health endpoint
- Run 9 different test queries
- Display results with assessment details
- Generate CSV output in the correct format

### Expected Behavior

For a query like "Java developer who collaborates well", you should see:
- Some "Knowledge & Skills" assessments (Java, programming)
- Some "Personality & Behavior" assessments (teamwork, collaboration)
- Balanced mix of both types
- 5-10 total recommendations

## CSV Output Format

For submission, the system generates CSV in this format:

```csv
Query,Assessment_url
"Query 1 text","https://www.shl.com/..."
"Query 1 text","https://www.shl.com/..."
"Query 2 text","https://www.shl.com/..."
```

Each query can have 5-10 assessment URLs.

## Architecture Summary

```
┌─────────────────┐
│  React Frontend │
│  (Vite + TS)    │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         ▼
┌─────────────────┐
│ Supabase Edge   │
│   Functions     │
│  (Deno + TS)    │
└────────┬────────┘
         │
         │ SQL
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   + pgvector    │
│   (Supabase)    │
└─────────────────┘
```

## Troubleshooting

### "No recommendations found"
- Ensure database is seeded (visit `/admin`)
- Try more specific queries with clear keywords
- Check browser console for API errors

### API returns 500 error
- Check that Edge Functions are deployed
- Verify database connection in Supabase dashboard
- Check Edge Function logs in Supabase

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors with `npm run typecheck`
- Ensure `.env` file has required variables

## Next Steps

1. **Seed Database**: Visit `/admin` and click "Seed Database"
2. **Test Frontend**: Try sample queries at `/`
3. **Test API**: Use curl or the test script
4. **Generate CSV**: Use test script to generate submission CSV
5. **Deploy**: Your application is already deployed on Supabase

## Support

For issues:
1. Check browser console for errors
2. Check Supabase Edge Function logs
3. Verify database has data: Run SQL query `SELECT COUNT(*) FROM assessments;`
4. Ensure environment variables are set correctly

## Production Checklist

- [x] Database schema created
- [x] Sample data seeded
- [x] Edge Functions deployed
- [x] Frontend built and ready
- [x] API endpoints tested
- [x] CORS configured
- [x] Error handling implemented
- [x] Documentation complete

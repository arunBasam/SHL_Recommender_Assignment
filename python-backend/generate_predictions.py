import requests
import csv
import os
from dotenv import load_dotenv
import time

load_dotenv()

API_URL = 'http://localhost:5000/recommend'

queries = [
    "Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script. Need an assessment package that can test all skills with max duration of 60 minutes.",
    "Job Description... Can you recommend some assessment that can help me screen applications. Time limit is less than 30 minutes",
    "I am hiring for an analyst and wants applications to screen using Cognitive and personality tests, what options are available within 45 mins.",
    "I have a JD Job Description... I am looking for a cognitive assessment that can be completed in less than an hour.",
    "Job Description... I am looking for an Assessment which covers Python, SQL, Tableau and can be completed in 60 minutes.",
    "I am looking to hire a Senior Data Analyst with 5 years of experience and expertise in SQL, Excel and Python. The assessment can be 1-2 hour long.",
    "I am hiring for an HR Specialist who is responsible for providing expert advice to employees on HR policies and procedures. Can you suggest an assessment package to screen candidates for this role?",
    "I have to hire a high volume of candidates for a Customer Service Representative position... What is the best test package I can use?",
    "I have a JD for an IT Help Desk Analyst... What is an ideal assessment package with a maximum duration of 1 hour to test candidates?"
]


def get_recommendations(query):
    try:
        response = requests.post(API_URL, json={'query': query}, timeout=30)
        if response.status_code == 200:
            data = response.json()
            return [a['url'] for a in data.get('recommended_assessments', [])]
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"Error processing query: {e}")
        return []


def generate_predictions():
    print('Generating predictions for all queries...\n')

    csv_rows = [['Query', 'Assessment_url']]

    for i, query in enumerate(queries, 1):
        print(f"Processing query {i}/{len(queries)}: \"{query[:60]}...\"")

        urls = get_recommendations(query)
        print(f"  -> Got {len(urls)} recommendations")

        for url in urls:
            csv_rows.append([query, url])

        time.sleep(0.1)

    output_path = os.path.join(os.path.dirname(__file__), '..', 'predictions.csv')

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(csv_rows)

    print(f"\n✅ Predictions generated successfully!")
    print(f"📁 File saved to: {output_path}")
    print(f"📊 Total rows: {len(csv_rows) - 1} (excluding header)")
    print(f"📝 Total queries: {len(queries)}")


if __name__ == '__main__':
    generate_predictions()

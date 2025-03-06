import os
import json
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from collections import Counter

# Download required nltk components
nltk.download('vader_lexicon')
nltk.download('punkt')

# Define party directories
base_dir = r"C:\Users\mtuma\Manifesto-Summarisation-Project\Manifestos"
party_dirs = [
    "Alliance", "Conservative", "DUP", "Green", "Labour", "LibDem",
    "PlaidCymru", "Reform", "SDLP", "SinnFein", "SNP", "TUV", "UUP"
]

# Pronouns to track
pronouns = ["we", "us", "our", "you", "your", "i", "me", "my"]

# Policy categories
policy_keywords = {
    "Crime": ["police", "crime", "justice", "law", "prison", "safety"],
    "Economy": ["tax", "budget", "growth", "investment", "business", "inflation", "jobs"],
    "Education": ["school", "university", "student", "teacher", "learning", "college", "education"],
    "Environment": ["climate", "carbon", "emissions", "renewable", "energy", "green", "pollution"],
    "Health": ["nhs", "hospital", "doctor", "nurse", "health", "medicine", "treatment"],
    "Housing": ["housing", "home", "rent", "mortgage", "affordable", "building"],
    "Immigration": ["border", "migrant", "visa", "asylum", "immigration", "citizenship", "refugee", "boats"],
    "Transport": ["rail", "bus", "train", "transport", "road", "highway", "infrastructure"]
}

# Initialize results
sentiment_results = {}
pronoun_results = {}
policy_results = {}

# Initialize Sentiment Analyzer
sia = SentimentIntensityAnalyzer()

def load_manifesto(file_path):
    """Loads the manifesto text from a given file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Manifesto not found: {file_path}")
        return None

def analyze_sentiment(text):
    """Performs sentiment analysis and returns the average compound score."""
    sentences = nltk.sent_tokenize(text)
    scores = [sia.polarity_scores(sentence)['compound'] for sentence in sentences]
    return sum(scores) / len(scores) if scores else 0

def count_pronouns(text):
    """Counts pronoun usage and returns percentage values."""
    words = text.lower().split()
    pronoun_counts = Counter(word for word in words if word in pronouns)
    total_pronouns = sum(pronoun_counts.values())
    return {p: (pronoun_counts[p] / total_pronouns * 100) if total_pronouns > 0 else 0 for p in pronouns}

def count_policy_mentions(text):
    """Counts policy-related word usage and returns percentage values."""
    words = text.lower().split()
    policy_counts = {category: sum(words.count(word) for word in keywords) for category, keywords in policy_keywords.items()}
    total_mentions = sum(policy_counts.values())
    return {category: (policy_counts[category] / total_mentions * 100) if total_mentions > 0 else 0 for category in policy_keywords}

# Process each party's manifesto
for party in party_dirs:
    file_path = os.path.join(base_dir, party, f"{party}Manifesto.txt")
    text = load_manifesto(file_path)
    
    if text:
        # Perform analyses
        sentiment_results[party] = analyze_sentiment(text)
        pronoun_results[party] = count_pronouns(text)
        policy_results[party] = count_policy_mentions(text)

# Rank sentiment scores
ranked_sentiment = sorted(sentiment_results.items(), key=lambda x: x[1], reverse=True)
sentiment_results = {party: {"sentiment_score": score, "rank": i+1} for i, (party, score) in enumerate(ranked_sentiment)}

# Save results to JSON
with open("sentiment_analysis.json", "w", encoding="utf-8") as f:
    json.dump(sentiment_results, f, indent=4)

with open("pronoun_usage.json", "w", encoding="utf-8") as f:
    json.dump(pronoun_results, f, indent=4)

with open("policy_breakdown.json", "w", encoding="utf-8") as f:
    json.dump(policy_results, f, indent=4)

print("Analysis complete! JSON files saved.")
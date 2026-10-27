"""Sentiment analysis microservice (Flask + VADER)."""
from flask import Flask, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask("Sentiment Analyzer")
analyzer = SentimentIntensityAnalyzer()


@app.route("/")
def home():
    return "Welcome to the Sentiment Analyzer. Use /analyze/<text>"


@app.route("/analyze/<input_txt>")
def analyze_sentiment(input_txt):
    score = analyzer.polarity_scores(input_txt)["compound"]
    if score >= 0.05:
        label = "positive"
    elif score <= -0.05:
        label = "negative"
    else:
        label = "neutral"
    return jsonify({"sentiment": label})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

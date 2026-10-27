import os

import requests

backend_url = os.getenv("backend_url", "http://localhost:3030").rstrip("/")
sentiment_analyzer_url = os.getenv("sentiment_analyzer_url", "http://localhost:5050/").rstrip("/") + "/"


def get_request(endpoint, **kwargs):
    params = "&".join(f"{k}={v}" for k, v in kwargs.items())
    request_url = f"{backend_url}{endpoint}" + (f"?{params}" if params else "")
    try:
        return requests.get(request_url, timeout=15).json()
    except Exception as err:
        print(f"Network exception occurred: {err}")
        return None


def analyze_review_sentiments(text):
    try:
        return requests.get(sentiment_analyzer_url + "analyze/" + text, timeout=15).json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    try:
        return requests.post(f"{backend_url}/insert_review", json=data_dict, timeout=15).json()
    except Exception as err:
        print(f"Network exception occurred: {err}")
        return None

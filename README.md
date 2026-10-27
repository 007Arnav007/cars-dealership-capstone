# Cars Dealership – Full-Stack Developer Capstone

**Project name:** Cars Dealership – Full-Stack Web Application
**Author:** YOUR NAME HERE  &nbsp;|&nbsp; **Course:** IBM Full-Stack Application Development Capstone

A responsive web application for a national U.S. car retailer where users can browse dealership branches,
filter them by state, read reviews (with sentiment analysis) and post their own reviews.

## Architecture

| Component | Tech | Port |
|---|---|---|
| Web app + REST proxy | Django 4/5, SQLite, React 18 (Bootstrap 5) | 8000 |
| Dealers & reviews service | Node.js, Express, MongoDB (Mongoose) | 3030 |
| Sentiment analyzer | Flask + VADER | 5050 (local) / 5000 (container) |
| CI | GitHub Actions (flake8, JSHint, Django check, React build) | – |
| Deployment | Docker, Kubernetes (`server/deployment.yaml`), IBM Cloud Code Engine | – |

## Run locally

```bash
./scripts/setup.sh                 # venv, deps, migrations, root user, React build
docker compose up -d --build       # MongoDB + dealers API (3030) + sentiment analyzer (5050)
cd server && ./venv/bin/python manage.py runserver   # http://localhost:8000
```

Admin: http://localhost:8000/admin — user `root` / password `Root@12345` (change it for real use).

## Main endpoints (Django)

`/djangoapp/login` · `/djangoapp/logout` · `/djangoapp/register` · `/djangoapp/get_cars` ·
`/djangoapp/get_dealers[/<state>]` · `/djangoapp/dealer/<id>` · `/djangoapp/reviews/dealer/<id>` · `/djangoapp/add_review`

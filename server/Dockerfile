# ---- stage 1: build React frontend ----
FROM node:18-slim AS frontend
WORKDIR /fe
COPY frontend/package.json frontend/.env ./
RUN npm install
COPY frontend/public ./public
COPY frontend/src ./src
RUN npm run build

# ---- stage 2: Django ----
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend /fe/build ./frontend/build
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]

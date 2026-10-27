#!/usr/bin/env bash
# One-time setup: Python venv, deps, DB migrations, root superuser, React build.
set -e
cd "$(dirname "$0")/../server"
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/python manage.py migrate
DJANGO_SUPERUSER_PASSWORD=Root@12345 ./venv/bin/python manage.py createsuperuser --noinput --username root --email root@example.com || true
(cd frontend && npm install && npm run build)
echo "Setup done. Admin login -> user: root  password: Root@12345"

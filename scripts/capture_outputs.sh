#!/usr/bin/env bash
# Runs every command required by the assignment and saves "command + output" into submission/<name>
# Prereqs: ./scripts/setup.sh done, `docker compose up -d` running (or database/ + sentiment_analyzer/ started).
set -u
cd "$(dirname "$0")/.."
OUT=submission; mkdir -p "$OUT"
DJ=${DJ:-http://localhost:8000}
API=${API:-http://localhost:3030}
SENT=${SENT:-http://localhost:5050}
PY=${PY:-python3}; [ -x server/venv/bin/python ] && PY=server/venv/bin/python
case "$PY" in */*) PY="$(cd "$(dirname "$PY")" && pwd)/$(basename "$PY")";; *) PY="$(command -v "$PY")";; esac
ROOT=$(pwd)

# --- Task 2: Django server running ---
pkill -f "manage.py runserver" 2>/dev/null; sleep 1
( cd server && "$PY" manage.py migrate --noinput >/dev/null 2>&1; \
  DJANGO_SUPERUSER_PASSWORD=Root@12345 "$PY" manage.py createsuperuser --noinput --username root --email root@example.com >/dev/null 2>&1 )
( cd server && nohup "$PY" manage.py runserver 0.0.0.0:8000 --noreload > "$ROOT/$OUT/django_server" 2>&1 < /dev/null & )
sleep 6

run() {  # run <file> <command...>
  f=$1; shift
  { echo "\$ $*"; echo; eval "$@"; echo; } > "$OUT/$f" 2>&1
  echo "saved $OUT/$f"
}
run loginuser        "curl -s -X POST $DJ/djangoapp/login -H 'Content-Type: application/json' -d '{\"userName\":\"root\",\"password\":\"Root@12345\"}'"
run logoutuser       "curl -s $DJ/djangoapp/logout"
run getdealerreviews "curl -s $DJ/djangoapp/reviews/dealer/29"
run getalldealers    "curl -s $DJ/djangoapp/get_dealers"
run getdealerbyid    "curl -s $DJ/djangoapp/dealer/15"
run getdealersbyState "curl -s $DJ/djangoapp/get_dealers/Kansas"
run getallcarmakes   "curl -s $DJ/djangoapp/get_cars"
run analyzereview    "curl -s $SENT/analyze/Fantastic%20services"
echo "Django server log is in $OUT/django_server (stop it with: pkill -f 'manage.py runserver')"

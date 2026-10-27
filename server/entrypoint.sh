#!/bin/sh
set -e
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py shell -c "
import os
from django.contrib.auth.models import User
u, p = os.getenv('ADMIN_USER', 'root'), os.getenv('ADMIN_PASSWORD', 'Root@12345')
if not User.objects.filter(username=u).exists():
    User.objects.create_superuser(u, 'root@example.com', p)
"
exec gunicorn djangoproj.wsgi:application -b 0.0.0.0:${PORT:-8000}

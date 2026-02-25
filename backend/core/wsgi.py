import os

from django.core.wsgi import get_wsgi_application

environment = os.getenv('ENVIRONMENT', 'development')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'core.settings.{environment}')

application = get_wsgi_application()

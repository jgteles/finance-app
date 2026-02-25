import os

from django.core.asgi import get_asgi_application

environment = os.getenv('ENVIRONMENT', 'development')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'core.settings.{environment}')

application = get_asgi_application()

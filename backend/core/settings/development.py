"""
Development settings for the Django project.
"""

from .base import *

# ===========================
# Debug
# ===========================

DEBUG = True

# Allow all hosts in development
ALLOWED_HOSTS = ["*"]

# ===========================
# Security (disabled for dev)
# ===========================

SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# ===========================
# CORS (dev open)
# ===========================

CORS_ALLOW_ALL_ORIGINS = True

# ===========================
# Logging
# ===========================

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    },
}
import os
from .base import *

# ===========================
# Core
# ===========================

DEBUG = False

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in production")

# ===========================
# Database
# ===========================

DATABASES["default"]["CONN_MAX_AGE"] = 600

# ===========================
# Security
# ===========================

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ===========================
# CORS
# ===========================

CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", ""
).split(",")

# ===========================
# Logging (Docker-friendly)
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
        "level": "INFO",
    },
}
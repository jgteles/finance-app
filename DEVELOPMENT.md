# Development setup guide

## Quick Commands

### Build all services

```bash
docker-compose build
```

### Start all services

```bash
docker-compose up -d
```

### Stop all services

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Run Django commands

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py shell
```

### Run frontend commands

```bash
docker-compose exec frontend npm install
docker-compose exec frontend npm run build
```

## Local Development (Without Docker)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup database
python manage.py migrate
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Setup

1. Copy environment files from examples:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Update values in each .env file with your configuration

3. For Docker, make sure .env is in the root directory

## Database

### Access PostgreSQL

```bash
docker-compose exec db psql -U joao -d financial_dashboard
```

### Access PgAdmin

- URL: http://localhost:5050
- Email: admin@example.com (or value from .env)
- Password: admin (or value from .env)

### Create admin user

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Common Issues

### Port already in use

- Change ports in docker-compose.yaml or .env

### Database connection refused

- Ensure db service is healthy: `docker-compose ps`
- Check database credentials in .env

### Frontend not loading

- Check if backend is accessible: `curl http://localhost:8000/api`
- Check VITE_API_URL in frontend/.env

## IDE Setup

### VSCode

1. Install extensions:
   - Python
   - Pylance
   - ESLint
   - Prettier
   - Thunder Client or REST Client

2. Create workspace settings at `.vscode/settings.json`:

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.formatting.provider": "black",
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.python"
  },
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Testing

### Backend tests

```bash
cd backend
python -m pytest
```

### Frontend tests

```bash
cd frontend
npm test
```

## Production Deployment

See deployment guide in the docs/ directory

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pytest`, `npm test`
4. Submit a pull request

## References

- [Django Docs](https://docs.djangoproject.com/)
- [React Docs](https://react.dev/)
- [Docker Docs](https://docs.docker.com/)

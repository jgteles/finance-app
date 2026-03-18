# Finance Dashboard App

Um dashboard de gerenciamento financeiro moderno construído com React (frontend) e Django (backend).

## 📋 Pré-requisitos

- Docker e Docker Compose
- Python 3.11+ (para desenvolvimento local)
- Node.js 18+ e npm (para desenvolvimento local)
- PostgreSQL 15+ (se não usar Docker)

## 🚀 Quick Start com Docker

### 1. Clone o repositório

```bash
git clone <seu-repo>
cd finance-app
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edite os arquivos com seus valores
```

### 3. Inicie os containers

```bash
docker-compose up -d
```

### 4. Execute as migrações do banco de dados

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### 5. Acesse a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **PgAdmin**: http://localhost:5050

## 🔧 Desenvolvimento Local

### Backend Setup

```bash
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure o arquivo .env
cp .env.example .env

# Execute as migrações
python manage.py migrate

# Inicie o servidor
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
finance-app/
├── backend/
│   ├── core/
│   │   ├── settings/
│   │   │   ├── base.py          # Configurações comuns
│   │   │   ├── development.py   # Configs de desenvolvimento
│   │   │   └── production.py    # Configs de produção
│   │   ├── asgi.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── transactions/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   ├── manage.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Componentes reutilizáveis
│   │   │   ├── features/        # Componentes por feature
│   │   │   ├── Header/
│   │   │   ├── Transaction/
│   │   │   └── Dashboards/
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   ├── api.tsx
│   │   │   ├── aiService.tsx
│   │   │   └── excelService.tsx
│   │   ├── hooks/
│   │   ├── types/               # Type definitions
│   │   ├── constants/           # Constants e configs
│   │   ├── utils/
│   │   └── config.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yaml
├── .env.example
└── .gitignore
```

## 🔐 Segurança

- **Never commit .env files** - Use .env.example como template
- **SECRET_KEY**: Sempre use uma chave segura em produção
- **Database Password**: Mude a senha padrão em .env
- **CORS**: Configure origens permitidas em produção

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=your-secret-key
POSTGRES_DB=financial_dashboard
POSTGRES_USER=joao
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=db
POSTGRES_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_GOOGLE_AI_KEY=your-key
VITE_ENABLE_EXCEL_EXPORT=true
VITE_ENABLE_AI_INSIGHTS=true
```

## 🧪 Testes

### Backend

```bash
cd backend
python -m pytest
# ou com coverage
python -m pytest --cov=transactions
```

### Frontend

```bash
cd frontend
npm run test
```

## 📦 Build para Produção

### Backend

```bash
cd backend
python manage.py collectstatic
```

### Frontend

```bash
cd frontend
npm run build
```

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

```bash
# Verifique se o container do PostgreSQL está rodando
docker-compose ps

# Verifique as credenciais no .env
# Tente pingar o host do banco
docker-compose exec backend ping db
```

### Porta já em uso

```bash
# Mude as portas no docker-compose.yaml
# Ou stop o container anterior
docker-compose down
```

### CORS errors

```bash
# Adicione a origem correta em backend/core/settings.py
# ou configure CORS_ALLOWED_ORIGINS no .env
```

## 📚 Documentação Adicional

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Vite Guide](https://vitejs.dev/)

## 👤 Autor

João Guilherme

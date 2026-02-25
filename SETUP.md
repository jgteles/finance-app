# Setup Instructions - Portuguese

## 🎯 Estrutura Refatorada

Sua aplicação foi completamente refatorada com:

✅ Settings Django separados (development/production)✅ Arquivos .env.example para configuração
✅ Estrutura de frontend melhorada
✅ Docker Compose com health checks
✅ Configurações de IDE (VSCode)
✅ README.md completo
✅ Guia de desenvolvimento

---

## 📝 Primeiros Passos

### 1. Configure os arquivos de ambiente

```bash
# Na raiz do projeto
cp .env.example .env

# No backend
cd backend && cp .env.example .env

# No frontend
cd frontend && cp .env.example .env
```

### 2. Edite os arquivos .env com suas credenciais

**Importante**: Atualize as senhas e chaves secretas nos arquivos .env

### 3. Inicie com Docker

```bash
docker-compose up -d
```

### 4. Execute as migrações

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### 5. Acesse a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin**: http://localhost:8000/admin
- **PgAdmin**: http://localhost:5050

---

## 🔧 Desenvolvimento Local

Se preferir não usar Docker:

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements-dev.txt
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Estrutura do Projeto

```
backend/
├── core/
│   └── settings/          ← Settings modularizados
│       ├── base.py        ← Configurações comuns
│       ├── development.py ← Dev settings
│       └── production.py  ← Prod settings
├── .env.example           ← Template de ambiente
├── requirements-dev.txt   ← Deps de desenvolvimento
└── pytest.ini             ← Config de testes

frontend/
├── src/
│   ├── components/        ← Componentes
│   │   ├── common/        ← Reutilizáveis
│   │   └── features/      ← Por feature
│   ├── types/             ← TypeScript types
│   ├── constants/         ← Constantes
│   ├── services/          ← API calls
│   ├── config.ts          ← Configuração
│   └── ...
├── .env.example           ← Template de ambiente
└── .env.development       ← Dev local
```

---

## 🔐 Segurança

⚠️ **Importante!**

1. **Nunca commite** arquivos `.env` - Use .env.example
2. **Mude o SECRET_KEY** em produção:
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```
3. **Mude as senhas** padrão do PostgreSQL
4. **Configure CORS** apropriadamente em produção
5. **Use HTTPS** em produção

---

## 📚 Variáveis de Ambiente

### Backend - .env

```env
# Django
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=sua-chave-secura-aqui
ALLOWED_HOSTS=localhost,127.0.0.1,seu-dominio.com

# Database
POSTGRES_DB=financial_dashboard
POSTGRES_USER=joao
POSTGRES_PASSWORD=sua-senha-aqui
POSTGRES_HOST=db
POSTGRES_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,seu-dominio.com
```

### Frontend - .env

```env
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_GOOGLE_AI_KEY=sua-chave-ai-aqui
VITE_ENABLE_EXCEL_EXPORT=true
VITE_ENABLE_AI_INSIGHTS=true
VITE_ENVIRONMENT=development
```

---

## 🧪 Testes

### Backend

```bash
cd backend
pip install -r requirements-dev.txt
pytest
# Com cobertura:
pytest --cov=transactions
```

### Frontend

```bash
cd frontend
npm test
```

---

## 🚀 Deploy em Produção

1. **Atualize SECRET_KEY** em .env
2. **Configure DEBUG=False**
3. **Configure ENVIRONMENT=production**
4. **Use um banco PostgreSQL externo** (não localhost)
5. **Configure um serviço de email** (SendGrid, AWS SES, etc)
6. **Use um CDN** para statics (AWS S3, CloudFlare, etc)
7. **Configure um proxy reverso** (Nginx, Traefik, etc)

Veja documentação de Deploy no seu serviço (AWS, Heroku, DigitalOcean, etc).

---

## 🛠️ Comandos Úteis

### Docker

```bash
docker-compose up -d       # Start
docker-compose down        # Stop
docker-compose logs -f     # Logs
docker-compose ps          # Status
```

### Django

```bash
python manage.py migrate   # Migrações
python manage.py createsuperuser  # Admin user
python manage.py shell     # Python shell
python manage.py runserver # Dev server
```

### Frontend

```bash
npm run dev                 # Dev server
npm run build              # Build prod
npm run preview            # Preview build
npm install                # Instalar deps
```

---

## 📖 Documentação

Veja os seguintes arquivos para mais informações:

- **[README.md](README.md)** - Overview do projeto
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guia de desenvolvimento
- **[.env.example](.env.example)** - Variáveis de ambiente

---

## ❓ Dúvidas?

1. Verifique os logs: `docker-compose logs backend`
2. Teste conectividade: `docker-compose exec backend ping db`
3. Verifique .env: `cat .env`
4. Verificar Django: `docker-compose exec backend python manage.py check`

---

## 📝 Próximos Passos

1. ✅ Clonar/Pull do repositório
2. ✅ Configurar .env files
3. ✅ Iniciar Docker Compose
4. ✅ Executar migrações
5. ⏳ Adicionar testes unitários
6. ⏳ Configurar CI/CD (GitHub Actions)
7. ⏳ Setup de logs centralizados
8. ⏳ Configurar monitoring

Sucesso! 🚀

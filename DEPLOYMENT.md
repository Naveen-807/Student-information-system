# Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Local Development Setup

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install backend and frontend dependencies
npm run install-all
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb sis_db

# Or using psql
psql -U postgres
CREATE DATABASE sis_db;
\q
```

### 3. Environment Configuration

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sis_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=/api
```

Notes:
- For local development, `/api` uses the Vite proxy to reach the backend.
- Only set an absolute `VITE_API_URL` when intentionally targeting a different remote backend.

### 4. Database Migration and Seeding

```bash
cd backend
npm run migrate
npm run seed
```

### 5. Start Development Servers

```bash
# From root directory
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

## Production Deployment

### Option 1: Traditional Server (VPS/EC2)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Database Setup

```bash
sudo -u postgres psql
CREATE DATABASE sis_db;
CREATE USER sis_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE sis_db TO sis_user;
\q
```

#### 3. Application Setup

```bash
# Clone repository
git clone <your-repo-url>
cd student-information-system

# Install dependencies
npm run install-all

# Configure environment variables
cd backend
cp .env.example .env
# Edit .env with production values

cd ../frontend
cp .env.example .env
# Edit .env with production API URL

# Run migrations
cd ../backend
npm run migrate
npm run seed

# Build frontend
cd ../frontend
npm run build
```

#### 4. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'sis-backend',
    cwd: './backend',
    script: 'src/server.js',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. Nginx Configuration

Create `/etc/nginx/sites-available/sis`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/student-information-system/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/sis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: sis_db
      POSTGRES_USER: sis_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: sis_db
      DB_USER: sis_user
      DB_PASSWORD: secure_password
      JWT_SECRET: your_jwt_secret
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:

```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create sis-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
heroku run npm run seed
```

#### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Railway

1. Connect GitHub repository
2. Add PostgreSQL database
3. Configure environment variables
4. Deploy automatically on push

## Environment Variables Reference

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | Yes |
| DB_HOST | PostgreSQL host | Yes |
| DB_PORT | PostgreSQL port | Yes |
| DB_NAME | Database name | Yes |
| DB_USER | Database user | Yes |
| DB_PASSWORD | Database password | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| JWT_EXPIRE | Token expiration time | Yes |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| AWS_ACCESS_KEY_ID | AWS S3 access key | No |
| AWS_SECRET_ACCESS_KEY | AWS S3 secret | No |
| AWS_REGION | AWS region | No |
| AWS_BUCKET_NAME | S3 bucket name | No |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## Post-Deployment

### 1. Verify Installation

```bash
# Check backend health
curl http://your-domain.com/api/health

# Check frontend
curl http://your-domain.com
```

### 2. Create Admin Account

If not using seed data:

```bash
# Use the registration endpoint or create directly in database
```

### 3. Configure Backups

```bash
# PostgreSQL backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U sis_user sis_db > $BACKUP_DIR/sis_backup_$DATE.sql

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

### 4. Monitoring

Set up monitoring with:
- PM2 monitoring: `pm2 monitor`
- Application logs: `pm2 logs`
- Database monitoring
- Uptime monitoring (UptimeRobot, Pingdom)

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U sis_user -d sis_db -h localhost
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Permission Issues

```bash
# Fix file permissions
chmod -R 755 /path/to/app
chown -R $USER:$USER /path/to/app
```

## Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Regular security updates
- [ ] Database backups
- [ ] Environment variables secured
- [ ] Remove debug logs in production

## Maintenance

### Update Application

```bash
git pull origin main
npm run install-all
cd backend && npm run migrate
pm2 restart all
```

### Database Maintenance

```bash
# Vacuum database
psql -U sis_user -d sis_db -c "VACUUM ANALYZE;"

# Check database size
psql -U sis_user -d sis_db -c "SELECT pg_size_pretty(pg_database_size('sis_db'));"
```

## Support

For issues and questions:
- Check logs: `pm2 logs`
- Review error messages
- Check database connectivity
- Verify environment variables

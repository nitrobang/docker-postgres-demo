# 🚀 Dockerized Portfolio + Cloud Deployment

This repository documents my **30 Days of Docker journey** – from learning container basics to deploying full-stack apps on the cloud with monitoring and CI/CD automation.  

---

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js + Express  
- **Database**: PostgreSQL  
- **Reverse Proxy**: Nginx  
- **Containerization**: Docker, Docker Compose  
- **Cloud**: AWS EC2, AWS ECS (Fargate), ECR  
- **Monitoring**: cAdvisor, Prometheus, Grafana  
- **CI/CD**: GitHub Actions (build → push → deploy via SSH)  

---

## ☁️ Docker/Cloud Setup

1. **Local Development**
   - Each service (frontend, backend, nginx, db) has its own Dockerfile.
   - `docker-compose.yml` spins up the entire stack locally.
   - Hot reload enabled for frontend/backend in dev mode.

2. **Production Deployment**
   - Images built & pushed to **DockerHub / AWS ECR**.
   - EC2 used initially for deployment (with Docker + Compose).
   - Later migrated to **AWS ECS (Fargate)** with **Application Load Balancer**.

3. **Security**
   - UFW firewall enabled → allow only SSH (22), HTTP (80), HTTPS (443).
   - SSH key authentication (no password login).
   - Secrets managed via GitHub Actions & AWS Secrets Manager.

---

## ⚙️ CI/CD Workflow (GitHub Actions)

- On **push to main**:
  1. Build Docker images (frontend, backend, nginx).  
  2. Tag with short Git commit SHA (`GITHUB_SHA:0:7`).  
  3. Push to DockerHub/ECR.  
  4. SSH into EC2:
     - Update `.env` with new `IMAGE_TAG`.  
     - `docker-compose pull` → fetch latest images.  
     - `docker-compose up -d --force-recreate`.  
     - `docker system prune -af --volumes` (cleanup).  

✅ Ensures every commit = new deployment.  
✅ Rollback by redeploying previous SHA tag.  

---

## 📊 Monitoring Setup

1. **cAdvisor** → Collects container-level metrics (CPU, memory, network, I/O).  
2. **Prometheus** → Scrapes metrics from cAdvisor.  
3. **Grafana** → Visualizes metrics, dashboards, and alerts.  

- Pre-built dashboards used:
  - Docker Container Monitoring (ID: 893).  
- Alerts configured:
  - CPU usage > 80% for 5m → email notification via Gmail SMTP.  

---


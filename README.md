🐳 30 Days of Docker – Portfolio Deployment

This repo documents my 30-day Docker journey, from basics to deploying a full-stack portfolio app with CI/CD, monitoring, and cloud setup.

📌 Tech Stack

Frontend: React (containerized)

Backend: Node.js / Express API (containerized)

Database: PostgreSQL + pgAdmin

Reverse Proxy: Nginx

Containerization: Docker & Docker Compose

Cloud Provider: AWS (EC2, ECS Fargate, ECR, ALB)

CI/CD: GitHub Actions (Docker build & deploy pipeline)

Monitoring:

cAdvisor (container-level metrics)

Prometheus (time-series monitoring)

Grafana (dashboards & alerting)

☁️ Docker + Cloud Setup

Local Development

Containerized frontend, backend, nginx, and DB using docker-compose.yml.

Init SQL scripts auto-run on first DB start.

AWS EC2 Deployment

Provisioned Ubuntu EC2.

Installed Docker & Docker Compose.

Secured server with UFW + SSH keys.

Deployed app stack via docker-compose.

AWS ECS (Fargate) Deployment

Built & pushed Docker images → AWS ECR.

Created ECS Cluster + Task Definitions (frontend, backend, nginx).

Used Application Load Balancer (ALB) to route traffic.

🔄 CI/CD Workflow

GitHub Actions Pipeline

Trigger on every push/merge to main.

Build Docker images for frontend, backend, nginx.

Tag images with GitHub SHA for uniqueness.

Push images to DockerHub / ECR.

SSH into EC2 server → update .env with new IMAGE_TAG.

Run docker-compose pull && docker-compose up -d --force-recreate.

Cleanup old images (docker system prune).

✅ Ensures zero-downtime deployments with reproducible builds.

📊 Monitoring Setup

cAdvisor

Runs as a container.

Exposes container CPU, memory, disk, and network metrics.

Prometheus

Scrapes metrics from cAdvisor (/metrics).

Provides a query language (PromQL).

Grafana

Connected to Prometheus as a data source.

Imported Docker + cAdvisor dashboard (ID: 893).

Visualizes container performance in real-time.

Alerts

Prometheus → alert rules (CPU > 80% for 5m).

Grafana → email/Slack notifications.

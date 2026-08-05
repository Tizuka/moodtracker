# MoodTracker DevOps Project

A simple MoodTracker application built with Node.js, Express and MongoDB, containerized with Docker and monitored with Prometheus and Grafana.

## Prerequisites

Install these applications before starting:

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Docker Desktop already includes Docker Compose. You do **not** need to install Node.js or MongoDB locally because Docker runs them inside containers.

After installing Docker Desktop, open it and wait until Docker is running.

You can confirm the installations with:

```bash
git --version
docker --version
docker compose version
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Tizuka/teste.git
```

### 2. Start the application

```bash
docker compose up --build
```

The first execution may take a few minutes because Docker needs to download and build the required images.

## Access the Services

After the containers start, open:

- **MoodTracker:** http://localhost:5000
- **Health check:** http://localhost:5000/health
- **Application metrics:** http://localhost:5000/metrics
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3001

## Stop the Project

Press `Ctrl + C` in the terminal and then run:

```bash
docker compose down
```

To also remove the stored MongoDB and Grafana data:

```bash
docker compose down --volumes
```

## Common Problem

If the application does not open, confirm that Docker Desktop is running and check the container status:

```bash
docker compose ps
```

To view the logs:

```bash
docker compose logs
```

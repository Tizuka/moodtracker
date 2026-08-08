# MoodTracker DevOps Project

A simple MoodTracker application built with Node.js, Express and MongoDB, containerized with Docker, orchestrated with Kubernetes/Minikube, and monitored with Prometheus and Grafana.

## Prerequisites

Install these applications before starting:

* [Git](https://git-scm.com/downloads)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

-- And if you want to test Kubernetes:
* [Minikube](https://minikube.sigs.k8s.io/docs/start/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)

Docker Desktop already includes Docker Compose.

You do **not** need to install Node.js or MongoDB locally because they run inside containers.

After installing Docker Desktop, open it and wait until Docker is running.

You can confirm the installations with:

```bash
git --version
docker --version
docker compose version
minikube version
kubectl version --client
```

## Getting Started with Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/Tizuka/moodtracker.git
cd teste
```

### 2. Start the application
obs: Let docker open while executing this command

```bash
docker compose up --build
```

The first execution may take a few minutes because Docker needs to download and build the required images.

## Access the Services

After the containers start, open:

* **MoodTracker:** http://localhost:5000
* **Health check:** http://localhost:5000/health or https://moodtracker-iunh.onrender.com/health
* **Application metrics:** http://localhost:5000/metrics or https://moodtracker-iunh.onrender.com/metrics
* **Prometheus:** http://localhost:9090
* **Grafana:** http://localhost:3001

## Testing with Minikube

The project can also be deployed locally to a Kubernetes cluster using Minikube.

This allows the Kubernetes manifests to be tested before deploying the application to a real Kubernetes environment.

### 1. Start Minikube

```bash
minikube start
```

Check that the cluster is running:

```bash
minikube status
```

You can also verify that Kubernetes is available:

```bash
kubectl get nodes
```

The Minikube node should appear with the status:

```text
Ready
```

### 2. Configure Docker to use Minikube

The application Docker image needs to be available inside Minikube.

On PowerShell, run:

```powershell
minikube docker-env --shell powershell | Invoke-Expression
```

After this command, Docker commands executed in the same terminal will use Minikube's Docker environment.

### 3. Build the application image

Build the image used by the Kubernetes Deployment:

```bash
docker build -t devops-server:v2 .
```

Confirm that the image exists:

```bash
docker images
```

You should see:

```text
devops-server   v2
```

### 4. Apply the Kubernetes manifests

Apply the Kubernetes configuration files:

```bash
kubectl apply -f minikube/
```

You can also apply the files individually:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f mongodb.yaml
kubectl apply -f prometheus.yaml
kubectl apply -f secrets.yaml
```

If the project uses ConfigMaps or Secrets, apply those manifests as well.

### 5. Check the Kubernetes resources

Check the Pods:

```bash
kubectl get pods
```

Check the Deployments:

```bash
kubectl get deployments
```

Check the Services:

```bash
kubectl get services
```

To see everything together:

```bash
kubectl get all
```

The application Pods should eventually show:

```text
Running
```

and the containers should show:

```text
READY 1/1
```

### 6. Check application logs

To inspect the logs from a Pod:

```bash
kubectl logs <pod-name>
```

First, find the Pod name:

```bash
kubectl get pods
```

Then use the returned name, for example:

```bash
kubectl logs devops-server-xxxxxxxxxx-xxxxx
```

If multiple replicas are running, Kubernetes creates multiple Pods and each Pod has its own name.

### 7. Access the application

If the application is exposed using a Kubernetes Service, Minikube can generate the local URL:

```bash
minikube service <service-name>
```

To print the URL without automatically opening the browser:

```bash
minikube service <service-name> --url
```

Replace `<service-name>` with the name defined in `service.yaml`.

For example:

```bash
minikube service devops-service --url
```

### 8. Test the health endpoint

After obtaining the application URL, test:

```text
<minikube-url>/health
```

For example:

```text
http://127.0.0.1:xxxxx/health
```

The `/health` endpoint can be used by Kubernetes readiness and liveness probes to determine whether the application is available.

### 9. Useful Kubernetes debugging commands

View detailed information about a Pod:

```bash
kubectl describe pod <pod-name>
```

View Deployment information:

```bash
kubectl describe deployment <deployment-name>
```

View Service information:

```bash
kubectl describe service <service-name>
```

Watch Pods while Kubernetes creates or restarts them:

```bash
kubectl get pods -w
```

### 10. Test Kubernetes self-healing

If the Deployment has multiple replicas, you can manually delete one Pod:

```bash
kubectl delete pod <pod-name>
```

Then check the Pods again:

```bash
kubectl get pods
```

Because the Deployment maintains the desired number of replicas, Kubernetes should automatically create a replacement Pod.

This demonstrates one of the main responsibilities of a Kubernetes Deployment: maintaining the desired application state.

### 11. Stop Minikube

When finished testing:

```bash
minikube stop
```

To completely remove the local Kubernetes cluster:

```bash
minikube delete
```

## Stop the Docker Compose Project

Press `Ctrl + C` in the terminal and then run:

```bash
docker compose down
```

To also remove the stored MongoDB and Grafana data:

```bash
docker compose down --volumes
```

## Common Problems

### Docker Compose application does not start

Confirm that Docker Desktop is running and check the container status:

```bash
docker compose ps
```

View the logs:

```bash
docker compose logs
```

### Kubernetes Pod does not start

Check the Pod status:

```bash
kubectl get pods
```

Then inspect the Pod:

```bash
kubectl describe pod <pod-name>
```

Check its logs:

```bash
kubectl logs <pod-name>
```

### ImagePullBackOff or ErrImagePull

If the Deployment uses a locally built image, make sure the image was built inside Minikube's Docker environment:

```powershell
minikube docker-env --shell powershell | Invoke-Expression
docker build -t devops-server:v2 .
```

If the Deployment uses:

```yaml
imagePullPolicy: Never
```

Kubernetes expects the image to already exist inside Minikube and will not try to download it from Docker Hub.

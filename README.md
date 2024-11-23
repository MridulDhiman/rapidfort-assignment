# Word to PDF Converter

A next.js based web application that converts Word documents (.docx) to PDF format with additional features like metadata viewing and password protection.


## Hosted URL

Website deployed <a href="http://a88d724475d6e491abaac533666041bc-516287461.ap-south-1.elb.amazonaws.com/">here</a>

## Features

- Upload and convert Word (.docx) documents to PDF
- View document metadata
- Password protect generated PDFs
- Containerized microservice architecture
- Simple and intuitive user interface
- Kubernetes deployment ready

## Tech Stack

- Frontend: React.js
- Backend: Next.js API routes
- Document Processing: libreoffice(for conversion to pdf), qpdf(for password protection)
- Container: Docker
- Orchestration: Kubernetes
- CI/CD: GitHub Actions

## Prerequisites

- Docker
- Kubernetes cluster (local minikube cluster and EKS cluster on AWS cloud)
- kubectl and eksctl CLI
- Node.js 
- Git

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/MridulDhiman/rapidfort-assignment.git
cd rapidfort-assignment
```

2. Build docker image:
```bash
docker build -t mrimann/rapidfort-assignment:latest . 
```
3. Run the docker container: 
```bash
docker run -p 3000:3000 rapidfort-assignment
```

The application will be available at `http://localhost:3000`

### Production Deployment
1. Create Cluster and NodeGroup in AWS EKS(Elastic Kubernetes Service) through EKS dashboard or using `eksctl` CLI
2. Update kube config to set the eks cluster as current context:
```bash
aws eks update-kubeconfig --name cluster-name --region region-name
```

3. Verify Current Context
```bash
kubectl config current-context
```

4. Verify if there are any nodes (worker nodes) created or not to deploy our workloads
```bash
kubectl get nodes
```

5. Apply the k8s manifests to EKS cluster
```bash
kubectl apply -f deployment.yml
kubectl apply -f service.yml
```


## API Endpoints

### Document Conversion API

```
POST /api/convert
Content-Type: multipart/form-data

Parameters:
- file: .docx file
- password (optional): PDF password protection
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- Docker image building and pushing to docker hub registry
- Manual deployment to production environment

View the workflow configuration in `.github/workflows/build.yml` and `.github/workflows/deploy.yml`

## Directory Structure

```
├── .github/workflows/         
├── public/          
├── src/    
    ├── app/
        ├── api/
            ├── convert/
    ├── components/
    ├── lib/     
├── node_modules/           
          
```

## Local Development Scripts

### Run Development Environment

```bash
#!/bin/bash
npm install
npm run dev
```

### Build and Run Docker Container

1. Build image: 
```bash
docker build -t mrimann/rapidfort-assignment:latest .
```
2. Run container: 
a. using `docker run command: 
```bash
docker run -p 3000:3000 rapidfort-assignment 
```
b. using `run-container.sh` bash script
```bash
#!/bin/bash
chmod +x run-container.sh
./run-container.sh
```

## Kubernetes Deployment

0. Remove the `.kube/config` file from current user directory.
1. Start minikube cluster:
```bash
minikube start
```

2. Deploy deployment:
```bash
kubectl apply -f deployment.yml
```

3. Deploy service:
```bash
kubectl apply -f service.yml
```

4. Verify the deployment and services
```bash
#!/bin/bash
kubectl get deployments
kubectl get services
```

4. Run the web server:
```bash
minikube service nextjs-service --url
```


## Troubleshooting

Common issues and solutions:

1. **Conversion fails:**
   - Check input file format
   - Verify sufficient system resources
   - Check logs: `kubectl logs deployment/nextjs-service`



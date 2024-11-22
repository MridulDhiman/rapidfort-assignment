#!/bin/bash

# Default values
DEFAULT_CONTAINER_NAME="rapidfort-assignment"
DEFAULT_PORT=3000
DEFAULT_IMAGE="mrimann/rapidfort-assignment:latest"

# Check if container name was provided as argument
CONTAINER_NAME=${1:-$DEFAULT_CONTAINER_NAME}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo "Error: Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to check if container already exists
check_container() {
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo "Warning: Container '$CONTAINER_NAME' already exists."
        read -p "Do you want to remove it? (y/n): " answer
        if [ "$answer" == "y" ]; then
            docker rm -f "$CONTAINER_NAME"
        else
            echo "Exiting..."
            exit 1
        fi
    fi
}

# Function to check if image exists
check_image() {
    if ! docker image inspect "$DEFAULT_IMAGE" >/dev/null 2>&1; then
        echo "Error: Image '$DEFAULT_IMAGE' not found."
        echo "Please build the image first using: docker build -t $DEFAULT_IMAGE ."
        exit 1
    fi
}

# Main execution
echo "Starting Docker container deployment..."

# Run checks
check_docker
check_image
check_container

# Run the container
echo "Running container '$CONTAINER_NAME'..."
docker run \
    --name "$CONTAINER_NAME" \
    -d \
    -p "$DEFAULT_PORT:$DEFAULT_PORT" \
    --restart unless-stopped \
    -e "NODE_ENV=production" \
    "$DEFAULT_IMAGE"

# Check if container started successfully
if [ $? -eq 0 ]; then
    echo "Container '$CONTAINER_NAME' started successfully!"
    echo "Access the application at http://localhost:$DEFAULT_PORT"
    echo "View logs using: docker logs $CONTAINER_NAME"
else
    echo "Error: Failed to start container"
    exit 1
fi
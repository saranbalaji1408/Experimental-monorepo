# Configure the Google Cloud provider
provider "google" {
  project = "cloudrun-workshop-2025"  # Replace with your GCP project ID
  region  = "us-central1"
}

# Check if the Artifact Registry repository already exists
data "google_artifact_registry_repository" "existing_repo" {
  count         = 1
  location      = "us-central1"
  repository_id = "docker-images1"
  
  # This prevents Terraform from errori
}

locals {
  # Determine if we need to create the repository
  repo_exists = try(data.google_artifact_registry_repository.existing_repo[0].repository_id, "") != "" ? true : false
}

# Create an Artifact Registry repository only if it doesn't exist
resource "google_artifact_registry_repository" "docker_repo" {
  count         = local.repo_exists ? 0 : 1
  location      = "us-central1"
  repository_id = "docker-images1"
  description   = "Docker repository for chat-web container images"
  format        = "DOCKER"
}

# Output the repository URL
output "repository_url" {
  value = local.repo_exists ? "${data.google_artifact_registry_repository.existing_repo[0].location}-docker.pkg.dev/cloudrun-workshop-2025/${data.google_artifact_registry_repository.existing_repo[0].repository_id}" : try("${google_artifact_registry_repository.docker_repo[0].location}-docker.pkg.dev/cloudrun-workshop-2025/${google_artifact_registry_repository.docker_repo[0].repository_id}", "Repository not created")
  description = "The URL of the Artifact Registry repository"
}

# Cloud Run service to deploy the container
resource "google_cloud_run_service" "default" {
  name     = "saran-web-terraform"
  location = "us-central1"

  template {
    spec {
      containers {
        # Make sure this image exists in your Artifact Registr
        image = "us-central1-docker.pkg.dev/cloudrun-workshop-2025/docker-images1/saran-web:latest"
        
        # Set the port that the container exposes
        ports {
          container_port = 3000
        }
        
        # Optional: Environment variables
        # env {
        #   name  = "API_URL"
        #   value = "https://saran-server-terraform-pw5zi6muuq-uc.a.run.app"
        # }
        
        # Resource limits
      }
    }
    
    # Optional: Configure container concurrency

  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# IAM policy to make the service publicly accessible
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.default.name
  location = google_cloud_run_service.default.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Output the service URL
output "service_url" {
  value = try(google_cloud_run_service.default.status[0].url, "Service URL not available")
}
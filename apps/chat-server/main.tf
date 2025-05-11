# Configure the Google Cloud provider
provider "google" {
  project = "cloudrun-workshop-2025"  # Replace with your GCP project ID
  region  = "us-central1"
}

# Create an Artifact Registry repository
resource "google_artifact_registry_repository" "docker_repo" {
  location      = "us-central1"
  repository_id = "docker-images1"
  description   = "Docker repository for container images"
  format        = "DOCKER"
}

# Output the repository URL
output "repository_url" {
  value = "${google_artifact_registry_repository.docker_repo.location}-docker.pkg.dev/${google_artifact_registry_repository.docker_repo.project}/${google_artifact_registry_repository.docker_repo.repository_id}"
  description = "The URL of the Artifact Registry repository"
}

# Cloud Run service to deploy the container
resource "google_cloud_run_service" "default" {
  name     = "saran-server-terraform"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/cloudrun-workshop-2025/docker-images/saran-server:latest"
               
        
        # Optional: Environment variables
        ports {
        container_port = 3000
        }
      }
    }
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
  value = google_cloud_run_service.default.status[0].url
}
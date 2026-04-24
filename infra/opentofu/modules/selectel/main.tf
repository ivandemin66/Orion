variable "project_name" {
  type = string
}

variable "region" {
  type = string
}

variable "kubernetes_version" {
  type = string
}

variable "node_count" {
  type = number
}

locals {
  cluster_name = "${var.project_name}-selectel-cluster"
}

output "deployment_profile" {
  value = {
    cloud              = "selectel"
    region             = var.region
    cluster_name       = local.cluster_name
    kubernetes_version = var.kubernetes_version
    node_count         = var.node_count
    object_storage     = "selectel-s3"
    container_registry = "selectel-container-registry"
    note               = "Ready for provider resources wiring in Selectel modules."
  }
}

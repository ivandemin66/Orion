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
  cluster_name = "${var.project_name}-sber-cluster"
}

output "deployment_profile" {
  value = {
    cloud              = "sber"
    region             = var.region
    cluster_name       = local.cluster_name
    kubernetes_version = var.kubernetes_version
    node_count         = var.node_count
    object_storage     = "sber-s3-compatible"
    container_registry = "sber-registry"
    note               = "Ready for provider resources wiring in SberCloud modules."
  }
}

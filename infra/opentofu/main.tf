terraform {
  required_version = ">= 1.6.0"
}

variable "project_name" {
  type    = string
  default = "mass-mvp"
}

variable "region" {
  type    = string
  default = "ru-central1"
}

locals {
  labels = {
    app = var.project_name
  }
}

output "deployment_profile" {
  value = {
    project = var.project_name
    region  = var.region
    note    = "Use provider-specific modules for Selectel, Yandex Cloud, or Sber-compatible environments."
  }
}


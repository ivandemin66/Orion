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

variable "cloud_target" {
  type        = string
  description = "Target cloud provider: yandex | selectel | sber"
  default     = "yandex"

  validation {
    condition     = contains(["yandex", "selectel", "sber"], var.cloud_target)
    error_message = "cloud_target must be one of: yandex, selectel, sber."
  }
}

variable "kubernetes_version" {
  type    = string
  default = "1.30"
}

variable "node_count" {
  type    = number
  default = 3
}

module "yandex" {
  source = "./modules/yandex"
  count  = var.cloud_target == "yandex" ? 1 : 0

  project_name       = var.project_name
  region             = var.region
  kubernetes_version = var.kubernetes_version
  node_count         = var.node_count
}

module "selectel" {
  source = "./modules/selectel"
  count  = var.cloud_target == "selectel" ? 1 : 0

  project_name       = var.project_name
  region             = var.region
  kubernetes_version = var.kubernetes_version
  node_count         = var.node_count
}

module "sber" {
  source = "./modules/sber"
  count  = var.cloud_target == "sber" ? 1 : 0

  project_name       = var.project_name
  region             = var.region
  kubernetes_version = var.kubernetes_version
  node_count         = var.node_count
}

locals {
  deployment_profile = one(concat(
    module.yandex[*].deployment_profile,
    module.selectel[*].deployment_profile,
    module.sber[*].deployment_profile
  ))
}

output "deployment_profile" {
  value = local.deployment_profile
}

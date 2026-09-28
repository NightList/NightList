variable "name" { type = string }
variable "organization_id" { type = string }

variable "database_password" {
  type      = string
  sensitive = true
}

variable "region" { type = string }
variable "site_url" { type = string }

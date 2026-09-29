variable "name" { type = string }
variable "github_repo" { type = string }
variable "production_branch" { type = string }
variable "root_directory" {
  type    = string
  default = null
}

variable "framework" {
  type    = string
  default = null
}

variable "output_directory" {
  type    = string
  default = null
}

variable "build_command" {
  type    = string
  default = null
}

variable "install_command" {
  type    = string
  default = null
}

variable "domain" {
  type    = string
  default = null
}

variable "env" {
  description = "environment variables (ใส่ทุก target: production, preview)"
  type = map(object({
    value     = string
    sensitive = bool
  }))
  default = {}
}

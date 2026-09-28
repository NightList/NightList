variable "name" { type = string }
variable "github_repo" { type = string }
variable "production_branch" { type = string }
variable "root_directory" { type = string }

variable "framework" {
  type    = string
  default = null
}

variable "output_directory" {
  type    = string
  default = null
}

variable "build_command" { type = string }

variable "install_command" {
  type    = string
  default = "cd ../.. && pnpm install --frozen-lockfile"
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

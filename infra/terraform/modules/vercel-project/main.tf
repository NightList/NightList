terraform {
  required_providers {
    vercel = { source = "vercel/vercel" }
  }
}

resource "vercel_project" "this" {
  name             = var.name
  framework        = var.framework
  root_directory   = var.root_directory
  build_command    = var.build_command
  install_command  = var.install_command
  output_directory = var.output_directory

  git_repository = {
    type              = "github"
    repo              = var.github_repo
    production_branch = var.production_branch
  }
}

resource "vercel_project_environment_variable" "this" {
  for_each   = { for k, v in var.env : k => v if v.value != "" }
  project_id = vercel_project.this.id
  key        = each.key
  value      = each.value.value
  sensitive  = each.value.sensitive
  target     = ["production", "preview"]
}

resource "vercel_project_domain" "this" {
  count      = var.domain == null ? 0 : 1
  project_id = vercel_project.this.id
  domain     = var.domain
}

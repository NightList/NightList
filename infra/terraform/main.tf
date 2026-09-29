locals {
  name         = "nightlist-${var.environment}"
  is_prod      = var.environment == "prod"
  sub          = local.is_prod ? "" : "${var.environment}."
  web_domain   = var.base_domain == "" ? null : "${local.sub}${var.base_domain}"
  api_domain   = var.base_domain == "" ? null : "api.${local.sub}${var.base_domain}"
  adm_domain   = var.base_domain == "" ? null : "admin.${local.sub}${var.base_domain}"
  supabase_url = "https://${module.supabase.project_ref}.supabase.co"
}

module "supabase" {
  source            = "./modules/supabase-project"
  name              = local.name
  organization_id   = var.supabase_organization_id
  database_password = var.supabase_db_password
  region            = var.supabase_region
  site_url          = local.web_domain == null ? "http://localhost:5173" : "https://${local.web_domain}"
}

module "web" {
  source            = "./modules/vercel-project"
  name              = "${local.name}-web"
  github_repo       = var.github_repo
  production_branch = var.production_branch
  root_directory    = "apps/frontend"
  framework         = "vite"
  output_directory  = "dist"
  build_command     = "cd ../.. && pnpm turbo run build --filter=@nightlist/frontend"
  domain            = local.web_domain
  env = {
    VITE_SUPABASE_URL      = { value = local.supabase_url, sensitive = false }
    VITE_SUPABASE_ANON_KEY = { value = var.supabase_anon_key, sensitive = false }
    VITE_API_URL           = { value = local.api_domain == null ? "" : "https://${local.api_domain}", sensitive = false }
  }
}

module "admin" {
  source            = "./modules/vercel-project"
  name              = "${local.name}-admin"
  github_repo       = var.github_repo
  production_branch = var.production_branch
  root_directory    = "apps/admin"
  framework         = "vite"
  output_directory  = "dist"
  build_command     = "cd ../.. && pnpm turbo run build --filter=@nightlist/admin"
  domain            = local.adm_domain
  env = {
    VITE_SUPABASE_URL      = { value = local.supabase_url, sensitive = false }
    VITE_SUPABASE_ANON_KEY = { value = var.supabase_anon_key, sensitive = false }
    VITE_API_URL           = { value = local.api_domain == null ? "" : "https://${local.api_domain}", sensitive = false }
  }
}

module "api" {
  source            = "./modules/vercel-project"
  name              = "${local.name}-api"
  github_repo       = var.github_repo
  production_branch = var.production_branch
  root_directory    = "apps/backend"
  framework         = null
  output_directory  = null
  build_command     = "cd ../.. && pnpm turbo run build --filter=@nightlist/backend"
  domain            = local.api_domain
  env = {
    NODE_ENV                  = { value = "production", sensitive = false }
    SUPABASE_URL              = { value = local.supabase_url, sensitive = false }
    SUPABASE_SERVICE_ROLE_KEY = { value = var.supabase_service_role_key, sensitive = true }
    CORS_ORIGINS = {
      value     = join(",", compact([local.web_domain == null ? "" : "https://${local.web_domain}", local.adm_domain == null ? "" : "https://${local.adm_domain}"]))
      sensitive = false
    }
    JOB_SECRET                = { value = var.job_secret, sensitive = true }
    QR_SIGNING_KEY            = { value = var.qr_signing_key, sensitive = true }
    LINE_CHANNEL_ACCESS_TOKEN = { value = var.line_channel_access_token, sensitive = true }
  }
}

output "supabase_project_ref" {
  value = module.supabase.project_ref
}

output "vercel_projects" {
  value = {
    web   = module.web.project_id
    admin = module.admin.project_id
    api   = module.api.project_id
  }
}

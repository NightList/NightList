terraform {
  required_providers {
    supabase = { source = "supabase/supabase" }
  }
}

resource "supabase_project" "this" {
  organization_id   = var.organization_id
  name              = var.name
  database_password = var.database_password
  region            = var.region

  lifecycle {
    ignore_changes = [database_password]
  }
}

# Auth: email + password เท่านั้น (ดู docs/ARCHITECTURE.md ข้อ 6)
resource "supabase_settings" "this" {
  project_ref = supabase_project.this.id

  auth = jsonencode({
    site_url                = var.site_url
    disable_signup          = false
    external_email_enabled  = true
    external_phone_enabled  = false
    mailer_autoconfirm      = false
    password_min_length     = 10
    mfa_totp_enroll_enabled = true
    mfa_totp_verify_enabled = true
  })
}

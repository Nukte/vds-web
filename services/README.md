# services/
#
# Data Access Layer (DAL) — All Supabase database calls MUST live in this directory.
# Direct database access from components, pages, or actions is strictly forbidden.
#
# Naming convention:
#   services/<entity>.ts        → e.g. services/apps.ts, services/projects.ts
#
# Each service file must:
#   - Import the typed server client from @/utils/supabase/server
#   - Return typed data using Database["public"]["Tables"]["<table>"]["Row"]
#   - Never expose raw Supabase client instances

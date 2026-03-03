-- ============================================================
-- Phase 3: app-icons storage bucket RLS policies
-- ============================================================
-- Before running this script, create the `app-icons` bucket
-- manually via Supabase Dashboard > Storage > Create Bucket.
-- Make sure "Public bucket" is ENABLED.
-- Then run this in Dashboard > SQL Editor.
-- ============================================================

CREATE POLICY "Public read app-icons"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'app-icons');

CREATE POLICY "Authenticated upload app-icons"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'app-icons' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update app-icons"
  ON storage.objects FOR UPDATE
  USING  (bucket_id = 'app-icons' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'app-icons' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete app-icons"
  ON storage.objects FOR DELETE
  USING  (bucket_id = 'app-icons' AND auth.role() = 'authenticated');

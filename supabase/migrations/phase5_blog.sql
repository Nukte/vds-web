-- ============================================================
-- Phase 5: Blog System
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ── 1. blogs table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT         NOT NULL UNIQUE,
  cover_image_url TEXT,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public can read all blogs
CREATE POLICY "Public read blogs"
  ON public.blogs FOR SELECT
  USING (true);

-- Only authenticated users can write
CREATE POLICY "Authenticated insert blogs"
  ON public.blogs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update blogs"
  ON public.blogs FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete blogs"
  ON public.blogs FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── 2. blog_translations table ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_translations (
  id          UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id     UUID   NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  locale      TEXT   NOT NULL CHECK (locale IN ('tr', 'en')),
  title       TEXT   NOT NULL,
  content_md  TEXT   NOT NULL DEFAULT '',
  UNIQUE (blog_id, locale)
);

ALTER TABLE public.blog_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read blog_translations"
  ON public.blog_translations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert blog_translations"
  ON public.blog_translations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update blog_translations"
  ON public.blog_translations FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete blog_translations"
  ON public.blog_translations FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── 3. blog-images Storage Bucket ─────────────────────────────
-- NOTE: You must ALSO create the "blog-images" bucket manually
-- in Supabase Dashboard > Storage > New Bucket (set it to Public).
-- Run the SQL policies below after creating the bucket.

-- Allow anyone to read objects in blog-images
CREATE POLICY "Public read blog-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Only authenticated users can upload/update/delete
CREATE POLICY "Authenticated upload blog-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated update blog-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete blog-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

/**
 * Auto-generated Supabase database types.
 * Placeholder — run `npx supabase gen types typescript --linked` after SQL migrations
 * to regenerate this file with the full schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Required by @supabase/supabase-js >= 2.46 for PostgrestVersion inference
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          slug: string;
          cover_image_url: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          cover_image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          cover_image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      blog_translations: {
        Row: {
          id: string;
          blog_id: string;
          locale: string;
          title: string;
          content_md: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          locale: string;
          title: string;
          content_md: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          locale?: string;
          title?: string;
          content_md?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_translations_blog_id_fkey';
            columns: ['blog_id'];
            referencedRelation: 'blogs';
            referencedColumns: ['id'];
          },
        ];
      };
      apps: {
        Row: {
          id: string;
          name: string;
          url: string;
          icon_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          icon_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          icon_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          tags: string[];
          github_url: string | null;
          live_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          tags?: string[];
          github_url?: string | null;
          live_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          tags?: string[];
          github_url?: string | null;
          live_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
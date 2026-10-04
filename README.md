# Portfolio & Admin Platform

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-udhk5vk7)

## ⚠️ Security Notice & Secret Rotation Warning

> **IMPORTANT**: If any API keys, access tokens, database URLs, or Supabase credentials were previously hardcoded or committed to version control in earlier commits, **they remain accessible in Git history**.
>
> 🔐 **Immediate Action Required**: Rotate all previously hardcoded or exposed secrets in your cloud providers (Supabase Dashboard, AWS IAM, API provider portals) immediately.

## 🚀 Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   VITE_ADMIN_EMAIL=your-admin-email@example.com
   ```
3. Ensure `.env` is listed in `.gitignore` and never committed to Git.

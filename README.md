# Olagunju Oluwaseyi Portfolio

A dark, reference-inspired portfolio starter for Technology & IT, Cybersecurity, and Production. Built with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, and designed for Vercel.

## Included

- Responsive public landing page and discipline pages
- Dynamic published project pages
- Admin login with Supabase Auth
- Admin authorization backed by `admin_users` and RLS (not merely a hidden route)
- Project CRUD: draft/publish, category, summary, case-study text, tags, links, featured state and ordering
- Experience and skills CRUD
- Site settings editor
- Media library upload UI
- SQL schema and storage policies

## 1. Create Supabase project

1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it.
3. In **Authentication → Users**, create your admin user. Disable public signups if you do not need public account creation.
4. Copy the user's UUID, then run this SQL using the actual UUID:

```sql
insert into public.admin_users (user_id) values ('YOUR-AUTH-USER-UUID');
```

5. In **Project Settings → API**, copy the Project URL and publishable/anon key. Never expose a service-role key in browser code or commit it to Git.

## 2. Configure locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Fill `.env.local` with your Supabase project URL and publishable/anon key. Visit `http://localhost:3000`. Admin login is at `/admin/login`.

## 3. Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Import the repository in https://vercel.com/new.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project → Settings → Environment Variables for Preview and Production.
4. Deploy. After every push to the connected branch, Vercel will build and deploy automatically.
5. Test `/admin/login`, add your admin UUID, create a draft project, publish it, and confirm it appears publicly.

## Content model

- `projects`: work in the technology, cybersecurity or production sections
- `experiences`: roles, contributions and dates
- `skills`: skills grouped by discipline
- `site_settings`: personal headline, bio and contact links
- `admin_users`: explicitly allowlisted CMS administrators
- `portfolio-media` storage bucket: assets intended for public display

## Security notes

- Keep the service-role key out of the client and out of Git.
- RLS is the real data boundary; the UI's admin check is an additional layer.
- The public media bucket is only for assets you intend to publish. Do not upload private CVs, identity documents, confidential client footage or sensitive security-lab evidence there. For private files, create a separate private bucket with authenticated, short-lived signed URLs.
- Use MFA on the admin account where available and a strong unique password.
- The SQL schema is intended to be run once on a fresh Supabase project. If you rerun it, policies may report that they already exist; do not blindly remove policies on a live database. The `is_portfolio_admin()` security-definer function is used by RLS policies to avoid recursive checks against the admin roster.

## Before calling it production-complete

This is a working starter, not a fully audited commercial CMS. Add rate limiting and security headers, error boundaries/toasts, image optimization, edit forms for experience/skills, richer rich-text editing, video hosting integration, and automated tests before relying on it for critical content. The initial media uploader uploads files and lists their names; copy the asset's public URL from Supabase Storage into a project's cover-image field. Do not treat an untested deployment as secure merely because RLS is enabled.

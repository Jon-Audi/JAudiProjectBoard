# JAudiProjectBoard — Field Guide

Homelab, SDR & hardware project tracker. Built with Next.js + Supabase + Vercel.

## Stack
- **Frontend:** Next.js 14 (App Router)
- **Database:** Supabase (Postgres)
- **Hosting:** Vercel (auto-deploy on git push)

---

## Setup (one-time)

### 1. Supabase — Run the schema
1. Go to your Supabase project → **SQL Editor**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** — this creates all tables and seeds the starter projects

### 2. Get your Supabase API keys
1. Supabase → **Settings → API**
2. Copy **Project URL** and **anon public** key

### 3. Set environment variables
**For local dev:**
```bash
cp .env.local.example .env.local
# Fill in your URL and anon key
```

**For Vercel (production):**
1. Vercel dashboard → your project → **Settings → Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key

### 4. Vercel deployment settings
When importing on Vercel:
- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)

---

## Local development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy
```bash
git add .
git commit -m "your message"
git push origin main
# Vercel auto-deploys in ~60 seconds
```

---

## Variable substitution in commands
Code blocks in guides support `{{DEVICE_NAME_FIELD}}` placeholders.
Add devices to the **Device Vault** and they auto-fill into every command.

Example: A device named "Proxmox1" with IP `192.168.1.10` will substitute:
- `{{PROXMOX1_IP}}` → `192.168.1.10`
- `{{PROXMOX1_USER}}` → whatever username you stored
- `{{PROXMOX1_HOST}}` → stored hostname

Newark, DE coordinates are always available as `{{LAT}}` and `{{LON}}`.

---

## Troubleshoot links
Every phase has a **🔮 Troubleshoot with Claude** button that opens a new Claude chat
pre-loaded with the project name, phase name, and all your saved device context.

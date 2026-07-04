# Attela Beach Resort — Deployment Checklist

## Pre-Deployment (Local)

- [ ] All environment variables set in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server actions if needed)
- [ ] Database schema created in Supabase (tables: users/profiles, bookings, experiences, events, gallery_items, menu_items, availability_blocks, site_settings, audit_log)
- [ ] Row Level Security (RLS) policies applied (see SQL in previous implementation notes)
- [ ] At least one Super Admin account created via Supabase Auth + profiles table
- [ ] Sample content added (experiences, menu items, site_settings for hero/contact)
- [ ] Build passes: `npm run build`

## Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add all environment variables in Vercel Dashboard (Project Settings → Environment Variables)
3. Deploy to Production
4. Add custom domain (e.g. attelabeachresort.com) in Vercel
5. Enable automatic HTTPS (automatic on Vercel)

## Supabase Production Setup

- [ ] Enable Email + Password authentication
- [ ] Set up Row Level Security policies (run the SQL script)
- [ ] Create storage bucket for gallery/media (public or authenticated)
- [ ] Enable daily automated backups
- [ ] (Optional) Set up Supabase Edge Functions or Webhooks for future WhatsApp API

## Post-Deployment Verification

- [ ] Public site loads correctly on mobile and desktop
- [ ] Booking form submits successfully and triggers notification
- [ ] Admin login works
- [ ] All CMS sections (Experiences, Availability, Settings, etc.) function correctly
- [ ] Changes made in admin reflect immediately on public site
- [ ] Contact information matches the official resort details
- [ ] Hero tagline/subtitle is editable via Settings

## Go-Live Checklist for Resort Team

- [ ] Staff trained using the Admin Guide in README.md
- [ ] Official phone numbers and WhatsApp updated in Settings
- [ ] Social media bios updated with new booking link
- [ ] First real booking tested end-to-end
- [ ] Monitoring: Check Vercel logs and Supabase for first 48 hours

## Future Phases (v2)

- Online M-Pesa payments
- Multi-language support (Swahili + English)
- Loyalty / rewards program
- Native mobile app (React Native or PWA)

---

**Platform built according to**: Attela Beach Resort Full Product & Technical Specification v1.0 (June 2026)

Ready for soft launch!
# beach-resort-webapp

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_cZkiV2m69E9gBCT1IYxWtI58mxY1)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

---

## Staff Admin Guide (Attela Beach Resort)

### Accessing the Admin Panel
1. Go to `https://yourdomain.com/admin`
2. Log in with the staff/admin credentials provided by the developer
3. You will see the Dashboard with today's bookings and quick stats

### Managing Content (No coding required)
- **Experiences** → Add, edit, reorder, or hide signature experiences (Sunset Boat Cruise, DJ Nights, etc.)
- **Events** → Add upcoming events with date, description, and optional poster image
- **Gallery** → Upload new photos/videos (staff can upload, admins can delete)
- **Menu & Pricing** → Update food, drinks, and boat ride prices
- **Availability** → Block dates for private events, maintenance, or holidays (affects public booking form)
- **Settings** → Update phone numbers, WhatsApp, email, opening hours, hero tagline, and social links

**Important**: All changes go live immediately on the public website. No need to "publish" or redeploy.

### Managing Bookings
- View all booking requests in **Bookings**
- Filter by date, status, or category
- Change status: Pending → Confirmed / Cancelled / Completed
- All status changes are logged for accountability

### Booking Notifications
- Every new booking request automatically sends a notification to the resort WhatsApp
- You will also see new bookings appear instantly on the Dashboard

### Best Practices
- Always double-check availability before confirming a booking
- Use the Availability Blocks tool for known busy/private dates
- Keep contact information in Settings up to date to prevent customer confusion/scams
- For urgent issues, use the direct WhatsApp button on the public site

### Need Help?
Contact the technical team (Super Admin) for:
- Adding new staff accounts
- Password resets
- Advanced integrations (full WhatsApp Business API, payments in v2)

---

**Last Updated**: July 2026
**Platform Version**: 1.0 (matches Full Product & Technical Specification)

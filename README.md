# Chaufal Tech — Website

A multi-page React (Vite) site for Chaufal Tech, built from the provided homepage
design and the Chaufal Manifesto (CT-OS-001).

## Pages included
Home · About · Services · Solutions · Work · Process · Blog · Contact

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/    Navbar, Footer, PageHero, CtaBanner, Icon, ScrollToTop
  data/          content.js — all copy/data used across pages (edit here first)
  pages/         one file per route
```

## Notes for next steps

- **Logo**: the navbar/footer currently use a placeholder monogram (inline SVG
  in `Navbar.jsx` and `Footer.jsx`). Swap it for the real logo file once ready —
  drop the image in `public/` and replace the `<svg>` block with an `<img>` tag.
- **Contact form**: `src/pages/Contact.jsx` is UI-only right now — it doesn't
  send anything. Wire it to an email service (e.g. Formspree, Resend) or your
  own backend endpoint.
- **Login / member area**: this was built with React Router so it's easy to
  extend — add a `/login` and `/account` route in `App.jsx`, and a place to
  store the logged-in user (React Context, or a library like Clerk/Auth0/
  Supabase Auth once you pick a backend). There's already a comment in
  `Navbar.jsx` marking where a "Log in" link can go.
- **Design tokens**: colors, fonts, and border-radius are centralized in
  `tailwind.config.js` under `theme.extend` — change them once, they apply
  everywhere.
- **Blog**: currently placeholder posts in `src/data/content.js`. When you're
  ready for real posts, consider moving this to a CMS (Sanity, Contentful) or
  MDX files rather than hardcoding.

# 5. Remove General User Authentication and Streamline Map Admin Mode

Date: 2026-09-07
Status: Accepted

## Context
Previously, MIANG MAP included a full user authentication subsystem (Email/Password login, Sign-Up with name and phone number, Google OAuth, and Password Reset) managed via Supabase Auth and `shared_auth.js`.

Following architectural shifts:
1. **ADR 0001**: The travel package booking flow was transformed into an interactive, zero-friction client-side Activity & Carbon Tracker with `localStorage` persistence and 1:1 Eco Rank Card export.
2. **ADR 0002**: Room booking was converted into direct host contacts via Facebook Pages and telephone, eliminating reservation records and the "My Bookings" view.

Consequently:
- Regular visitors had no features tied to user accounts (no profile, no booking history, no comments/reviews).
- The presence of "Login / Sign Up" buttons created cognitive friction, confusing visitors about whether an account was required.
- The only functional use of authentication was for the village administrator (`miangmap@gmail.com`) in `map/index.html` to drag pins and edit location data.
- `home/index.html" and `travel_package/index.html` loaded Supabase and Auth scripts despite never querying the database.

## Decision
We decided to remove general user authentication across all public pages and consolidate administrative privileges into a discreet, URL-triggered Admin Mode on the map:

1. **Clean Visitor Interface (Zero User Auth Friction)**:
   - Remove the "Login / Sign Up" button (`#authBtn`) from desktop and mobile navigation bars across all pages (`home`, `map`, `attraction`, `travel_package`).
   - Remove login modals (`#loginModal`, `#updatePasswordModal`) and obsolete auth CSS styles from all pages.
2. **De-clutter Non-Database Pages**:
   - In `home/index.html` and `travel_package/index.html`: Remove Supabase SDK and `shared_auth.js` script imports, optimizing page load times and eliminating dead JavaScript.
   - In `attraction/index.html`: Retain read-only Supabase client initialization for fetching attraction details by ID, but remove all authentication code and modals.
3. **Streamlined Admin Mode for Map (`map/index.html?admin=true`)**:
   - Access: When an administrator navigates to `map/index.html?admin=true`:
     - If already authenticated as `miangmap@gmail.com`: Admin Mode activates automatically.
     - If not authenticated: Displays a compact Admin Login Modal (Email + Password only; all Google OAuth, Sign-Up links, and registration fields removed).
   - In-App Controls: When Admin Mode is active:
     - Map markers become draggable (`draggable: true`) with drag-to-update coordinate capabilities.
     - Marker popup cards display the "✏️ แก้ไขข้อมูลหมุด (Admin)" button.
     - A floating Admin Badge (`🔑 โหมดผู้ดูแลระบบ (Admin) [ออกจากระบบ]`) appears at the corner to provide clear status and single-click sign-out.
   - Sign-Out: Clicking sign-out ends the session, revokes admin privileges, and returns the map to public mode.

## Consequences
- 100% zero-friction experience for all tourists and visitors.
- Significantly reduced DOM node count, CSS rules, and network requests across all pages.
- Cleaner, more maintainable codebase focused on community tourism and carbon tracking.
- Secure, lightweight administrative maintenance for map locations.

# 2. Shift Map from Room Booking to Direct Contact & Place Directory

Date: 2026-09-04
Status: Accepted

## Context
The interactive map (`map/index.html`) previously featured an in-app room reservation and booking flow for homestays:
- Markers displayed room availability counters ("สถานะห้องพัก: ว่าง X ห้อง | จองแล้ว Y ห้อง").
- Users clicked "Book Now" to fill a booking form, followed by manual bank slip uploads, approval queues, and admin room tally management.

In practice for community-based tourism at Ban Pa Miang:
1. Village homestays are operated by local families who primarily manage bookings and guest inquiries directly through their Facebook Pages, messenger, and telephone.
2. Web-based room booking without real-time synchronization created risks of double-booking, outdated room counts, and unnecessary admin overhead for village coordinators.
3. Visitors prefer directly chatting with hosts on Facebook to view recent room photos, confirm seasonal conditions, and coordinate arrival logistics.

## Decision
We decided to completely remove the transactional room booking system and transform the map into a **Direct Contact & Place Discovery Directory**:
1. **Deprecate Booking Subsystem**:
   - Removed all reservation modals (`bookingModal`, `bookingSuccessModal`, `myBookingsModal`, `editBookingModal`, `adminBookingsModal`).
   - Removed booking navigation buttons (`myBookingsBtn`, `adminBookingsBtn`).
   - Removed room inventory counters (`available_rooms`, `booked_rooms`) from popup cards and admin editor forms.
2. **Facebook-First Contact Architecture**:
   - Primary action for homestays and community venues is **"📘 ส่งข้อความ / เพจ Facebook"**, directly opening the host's Facebook page.
   - Graceful fallback: If no Facebook page exists, **"📞 โทรติดต่อทันที"** is promoted to the primary action button.
   - If both exist, the telephone number is displayed as a clean secondary contact action.
3. **Story & Navigation Integration**:
   - Added **"🔍 ดูเรื่องราว & ข้อมูลเพิ่มเติม"** linking to the detailed attraction/story page (`attraction/index.html?id=...`).
   - Added **"🧭 นำทางด้วย Google Maps"** linking directly to Google Maps turn-by-turn directions.

## Consequences
- Zero booking friction and elimination of stale room count data.
- Direct host-to-visitor relationships supporting authentic community tourism.
- Significant reduction in frontend complexity and improved performance on mobile devices.

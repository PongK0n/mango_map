# 4. Minimal Square Eco Rank & Credit Summary Card

Date: 2026-09-06
Status: Accepted

## Context
Following user feedback on the official certificate design, the formal diploma/certificate format (with extensive borders, serials, and dual authority signatures) was deemed too elaborate for casual travelers and social sharing. Visitors prefer a **plain, minimal, lightweight summary card (การ์ดแสดงผลแรงก์และยอดเครดิตคาร์บอนแบบเพลน มินิมัล)** focusing strictly on:
1. Traveler name
2. Prestige rank achieved
3. Total carbon credits saved & net carbon impact
4. A warm, authentic thank-you message from the Ban Pa Miang community
5. Frictionless sharing: 1:1 Square aspect ratio optimized for Instagram/Facebook/LINE feeds and stories.

## Decision
We decided to replace the elaborate formal certificate with the **Minimal Square Eco Rank Card (1:1 Aspect Ratio)**:

1. **Clean Square Form Factor (1:1 Ratio)**:
   - Sized at 480px × 480px (scalable for high-DPI export), ideal for social feeds, mobile screens, and quick downloads.
   - Clean, unpretentious aesthetic: Pure white background (`#FFFFFF`), crisp typography (`Sarabun` and `Barlow`), soft rounded corners (`16px`), and subtle elevation shadow.

2. **Focused Content Hierarchy**:
   - **Community Branding**: `🌿 บ้านป่าเหมี้ยง • MIANG MAP` (subtle muted gray, centered).
   - **Traveler Name**: Personalized name displayed in warm, friendly typography (`#1E293B`).
   - **Rank Badge & Title**: Centered honor medal icon (🥇 / 🥈 / 🥉) with prestige tier title (e.g., `ระดับเหรียญทอง: ผู้พิทักษ์ผืนป่าเหมี้ยง`).
   - **Hero Metric (Carbon Credits Saved)**: Prominent emerald green stat (`🌱 ลดคาร์บอนได้ -X.XX kgCO2e`) with a neat subtitle indicating net footprint (`คาร์บอนสุทธิ X.XX kgCO2e`).
   - **Community Thank You Message**: *"ขอบคุณที่ร่วมท่องเที่ยวอย่างรับผิดชอบ และช่วยดูแลผืนป่าต้นน้ำบ้านป่าเหมี้ยงไปด้วยกัน"*.

3. **Streamlined Actions**:
   - **Save Image (PNG 1:1)**: Instant client-side PNG export via `html2canvas` at 3x resolution (1440 × 1440 px).
   - **Copy Text**: Copies a short, formatted social media caption with stats and thank-you note.
   - Removed cumbersome A4 print and formal certificate elements to align with the minimal card vision.

## Consequences
- Significant reduction in visual noise and clutter.
- Greatly improved social shareability and mobile user experience.
- Authentic reflection of Ban Pa Miang's design principle of "Honest Simplicity".

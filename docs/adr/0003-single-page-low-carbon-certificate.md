# 3. Single-Page Low Carbon Official Certificate of Recognition

Date: 2026-09-06
Status: Accepted

## Context
Following the implementation of the Low Carbon Activity Tracker (`travel_package/index.html`), visitors can track emissions and view a basic modal summary ticket. However, visitors and community hosts need an official, prestigious **Certificate of Recognition (ประกาศนียบัตรเกียรติคุณ)** that:
1. Fits strictly on a **single page (1-page A4 Landscape)** when printed or saved as PDF without unwanted page overflow.
2. Prominently displays gross carbon emissions, carbon offsets saved, and final net carbon footprint with scientific references (TGO & IPCC 2006).
3. Celebrates traveler participation through positive reinforcement ranks (Prestige Tiers) rather than negative feedback labels.
4. Carries community authenticity and authority via dual endorsement (Community Enterprise President & MIANG MAP Project Coordinator), a digital gold seal, verifiable serial number, and dynamic QR code.
5. Provides versatile export capabilities: Browser Print to A4 PDF, high-resolution PNG image download, and a standalone shareable URL.

## Decision
We decided to implement the **Single-Page Eco Certificate (ใบประกาศนียบัตรเกียรติคุณการท่องเที่ยวคาร์บอนต่ำ)**:

1. **Dual Access Mode**:
   - **Modal Preview**: Accessible immediately via the "🎫 ออกประกาศนียบัตร Eco Certificate" button inside `travel_package/index.html`.
   - **Standalone Shareable Page**: Located at `certificate/index.html`, accepting query parameters (`name`, `gross`, `saved`, `net`, `tier`, `serial`, `date`) allowing travelers to share their certificate permanently or embed it in sustainability portfolios.

2. **Layout & Print Precision (Single-Page A4 Landscape)**:
   - Fixed aspect ratio and `@page { size: landscape; margin: 0; }` configuration ensuring the certificate occupies exactly 1 single sheet of A4 paper.
   - Elegant Lanna-inspired borders and botanical watermarks using a refined palette: **Premium Ivory (`#FDFBF7`)**, **Deep Forest Green (`#1E3A2B`)**, and **Warm Amber Gold (`#C59B27`)**. This prevents excessive ink consumption while maintaining high aesthetic value.

3. **Prestige Ranking & Carbon Metrics**:
   - **Three Positive Honor Tiers**:
     - 🥇 **เหรียญทอง (Gold Tier) — ผู้พิทักษ์ผืนป่าเหมี้ยง (Forest Guardian)**: Net Carbon < 15 kgCO2e
     - 🥈 **เหรียญเงิน (Silver Tier) — นักเดินทางรักษ์ธรรมชาติ (Eco Pathfinder)**: Net Carbon 15 – 30 kgCO2e
     - 🥉 **เหรียญทองแดง (Bronze Tier) — ทูตการท่องเที่ยวสีเขียว (Green Ambassador)**: Net Carbon > 30 kgCO2e
   - **Triple Carbon Metrics Grid**: Gross Emissions (kgCO2e), Carbon Offset Savings (kgCO2e), and Net Carbon Footprint (kgCO2e) prominently displayed alongside official TGO (อบก.) & IPCC 2006 standard attribution.

4. **Community Endorsement & Verification**:
   - Dual endorsement signature blocks for the President of the Ban Pa Miang Community Tourism Enterprise and the MIANG MAP Project Coordinator.
   - Dynamic QR Code leading to verification and community low-carbon routes.
   - Formatted serial number (e.g., `PM-2026-CERT-XXXX`).

5. **Multi-Channel Actions**:
   - `Print / Save as PDF`: Zero-margin single-page A4 print setup.
   - `Download Image (PNG)`: Client-side canvas export for social media sharing.
   - `Copy Share Link`: Copies permalink with encoded stats for instant verification.

## Consequences
- Elevated traveler satisfaction and community engagement through a tangible, collectible credential.
- Adherence to WCAG readability standards and ink-efficient printing.
- Standardized recognition terminology across the platform.

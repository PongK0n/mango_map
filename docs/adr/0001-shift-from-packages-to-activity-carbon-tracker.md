# 1. Shift from Static Travel Packages to Interactive Activity & Carbon Tracker

Date: 2026-09-04
Status: Accepted

## Context
Originally, the platform provided 3 pre-defined static travel packages (Adventure, Foodie, Scenic) plus a flexible trip option (ID 99) in `travel_package/index.html`. Users had to view package details and complete a multi-step booking form requiring dates, contact details, and account logins before receiving a challenge pass.

In community-based tourism at Ban Pa Miang:
1. Visitors rarely follow rigid multi-day package itineraries; they prefer choosing individual activities based on personal interest, local weather, and physical ability.
2. The registration and booking flow introduced unnecessary friction for casual visitors and those already in the village who simply want to know their carbon impact.
3. Users wanted an intuitive way to pick the specific community activities they engage in and see their exact carbon footprint and carbon savings in real time.

## Decision
We decided to transform `travel_package/index.html` from a static package browsing & registration page into an **Interactive Low Carbon Activity & Carbon Tracker**:
1. **Interactive Checklist (Zero Friction)**: Users can directly check and uncheck items without needing to log in or fill out booking forms.
2. **Three-Tier Activity Categorization**:
   - **Main Transportation**: Single choice for inbound travel to Pa Miang (Gasoline car, EV, Community shared truck) with TGO emission factors.
   - **Village Experiences & Stay**: Multi-select options for local experiences (Homestay overnight, Doi Kiu Fin pickup truck, Tea harvesting & roasting, Herbal foot spa, Local organic meal, Forest shade coffee).
   - **Green Actions & Offsets**: Multi-select sustainable behaviors that reduce carbon (Reusable cups/containers, Walking instead of vehicle, Plogging/trail cleanup, Conserving homestay energy, Plastic-free packaging/banana leaf wrappers).
3. **Two-Sided Real-Time Carbon Dashboard**:
   - Total Gross Emissions (kgCO2e)
   - Total Carbon Saved / Offsets (kgCO2e)
   - Net Footprint & Eco Tier Badge (ดีต่อสิ่งแวดล้อม / ปานกลาง / ควรปรับปรุง)
4. **Pa Miang Eco Summary Card**:
   - Users can generate and view a personalized Eco Certificate/Card with their name, date, stats, and badge.
   - Saves selection state to browser `localStorage` so users can return and update their checklist during their visit.
5. **Updated Terminology**:
   - Updated navigation and headers to **"กิจกรรม & คำนวณคาร์บอน (Eco Activities & Carbon)"**.

## Consequences
- Greatly reduced user friction and increased engagement.
- Clean, focused UI aligned with the authentic community tourism experience.
- Preserves scientific emission references (TGO and 2006 IPCC Guidelines).

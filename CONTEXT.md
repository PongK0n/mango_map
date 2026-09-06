# MIANG MAP - Project Context

## Domain Model & Features

MIANG MAP is a community tourism platform for Ban Pa Miang (บ้านป่าเหมี้ยง) in Lampang, Thailand. It supports low-carbon tourism by allowing visitors to view, plan, and register their trips, then track their carbon footprint and engage in eco-friendly challenges while in the community.

### Low Carbon Activities & Carbon Tracker (กิจกรรม & คำนวณคาร์บอน)
Instead of rigid pre-defined travel packages, the platform provides an interactive, zero-friction **Low Carbon Activity Tracker & Calculator** (`travel_package/index.html`).
- **Purpose**: Allows visitors to select inbound transport and tick off individual village activities (homestay, tea craft, coffee, local meals, viewpoints) and green offset actions (tumblers, walking, waste cleanup).
- **Real-time Carbon Assessment**: Calculates gross emissions, green savings, net carbon, and eco rating dynamically based on TGO and IPCC standards.
- **Minimal Square Eco Rank Card (การ์ดแสดงผลแรงก์และเครดิตคาร์บอน 1:1)**: Users can generate a clean, plain square card displaying their traveler name, prestige rank achieved, carbon credits saved, net carbon impact, and a community thank-you message. Designed in a 1:1 square ratio optimized for saving as high-resolution PNG images and sharing to social media feeds (Instagram, Facebook, LINE). Saved locally in `localStorage` for uninterrupted tracking during travel.

### Interactive Map & Direct Contact Directory
- **Discovery & Direct Contact**: The interactive map (`map/index.html`) serves as a community directory for homestays, eco-attractions, cafes, and local shops. Rather than in-app room reservations, homestay cards prioritize direct communication via **Facebook Pages** (with telephone fallback), detailed story pages (`attraction/index.html?id=ID`), and Google Maps turn-by-turn navigation.
- **Show on Map (ดูตำแหน่งบนแผนที่)**: From attraction detail pages, clicking "📍 ดูตำแหน่งบนแผนที่ / Show on Map" opens `map/index.html?focus=ID`, smoothly panning, zooming (level 17), and opening the target popup card.

### Authentication & Admin Mode Architecture
- **Zero-Friction Visitor Experience**: All visitor-facing pages (`home`, `travel_package`, `attraction`, `map`) have no login or sign-up barriers. Visitors can freely explore, compute carbon footprints, and generate eco cards without user accounts.
- **Discreet Map Admin Mode (`map/index.html?admin=true`)**: Administrative privileges (dragging pins, editing location metadata) are accessed discreetly by administrators via query parameter and a compact Supabase login form, with an active floating badge providing single-click sign-out.

---

## Carbon Calculation & Scientific References

Carbon footprint evaluations are aligned with official standards:
1. **Thailand Greenhouse Gas Management Organization (TGO / อบก.)** guidelines for emission factors of transport and products.
2. **2006 IPCC Guidelines for National Greenhouse Gas Inventories** for waste disposal factors.

### 1. Transportation Carbon Footprint (ไป-กลับเมืองลำปาง 160 กม.)
- **Gasoline Personal Car**: 160 km × 0.2697 kgCO2e/km = **43.15 kgCO2e** (Baseline)
- **Electric Vehicle (EV)**: 160 km × 0.0970 kgCO2e/km = **15.52 kgCO2e**
  *(Based on Thailand's Grid Emission Factor 0.5562 kgCO2e/kWh and average mid-sized EV energy consumption 0.174 kWh/km)*
- **Community Pick-up Truck (Shared)**: 160 km × 0.0538 kgCO2e/km per person = **8.60 kgCO2e**
  *(Based on shared community pick-up truck / small public transport emission factors divided by at least 5 passengers)*

### 2. In-Village Activity Carbon Footprint (per person/day)
- **Local Food**: **20.4347 kgCO2e/person/day**
  *(Calculated using organic local ingredients that minimize Food Miles [0 km] + LPG usage for cooking 0.1 kg + Pork 1.5 kg + Chicken 1.5 kg + Vegetables 2 kg, mapped to TGO product carbon footprint factors)*
- **Homestay Energy**: **0.1557 kgCO2e/person/night**
  *(Formula: 0.035 kW [30W fan + 5W LED bulb] × 8 hours × Grid Emission Factor 0.5562 kgCO2e/kWh)*
- **General Waste**: **0.7933 kgCO2e/person/day**
  *(Formula: 1 kg waste/person/day × TGO landfill management emission factor 0.7933 kgCO2e/kg)*
- **In-Village Local Travel**: **2.6970 kgCO2e/trip**
  *(Based on local shared pick-up trucks traveling 10 km on average)*

### 3. Green Checklist / Challenge Pass Offsets (kgCO2e saved per action)
When guests perform sustainable tasks on their Challenge Pass, carbon reductions are estimated as:
- **Local Transport Choice** (using walking/local vehicles): **-3.0 kgCO2e/person**
- **Single-use Plastic Reduction** (reusable cups/bags): **-1.2 kgCO2e/person**
- **Zero-Food-Miles Eating** (local organic menu): **-2.5 kgCO2e/person**
- **Homestay Resource Conservation** (turning off lights/fans): **-1.0 kgCO2e/person**
- **Eco-Activity Participation** (conservation walking/plogging): **-2.0 kgCO2e/person**

### 4. Empirical Village Activity Carbon Lifecycle Calculations (Field Research Document, ADR 0006)
Specific empirical lifecycle measurements recorded for Ban Pa Miang community experiences:
- **Tea Pillow & Tea Doll Crafting (หมอนใบชา & ตุ๊กตาชา โดย พี่สุนีย์)**: **0.70 kgCO2e/item**
  *(Wild assam tea leaves dried naturally with zero emissions; cotton casing 1 kg emits 1.5 - 3.5 kgCO2e, tailored and transported at 5 - 6 kgCO2e; ~120g cotton per craft item = 0.70 kgCO2e)*
- **Agroforestry Mixed Garden Walking Tour (เดินทัวร์สวนเกษตรผสมผสาน โดย แม่สายชล)**: **0.00 kgCO2e**
  *(Direct walking tour from homestays to coffee/tea/avocado orchards with zero fuel use)*
- **Traditional Khan Tok 3-Dish Meal (สำรับขันโตกพื้นบ้าน 3 เมนู โดย พี่ติ๋ง / พี่หนุ่ม)**: **1.70 - 2.60 kgCO2e/set (avg 0.85 kgCO2e/person/meal)**
  *(Breakdown: Nam Prik Num + Steamed Veg 0.25–0.40 kgCO2e [0-mile]; Gaeng Khae Gai Baan 0.80–1.20 kgCO2e; Yum Bai Miang Samunphrai 0.30–0.50 kgCO2e; Organic sticky rice in banana leaf + cooking LPG 0.35–0.50 kgCO2e)*
- **Complete Lifecycle Coffee Workshop (เวิร์กช็อปเปิดโลกกาแฟครบวงจร โดย พี่คมสันต์ / พี่หนุ่ม)**: **0.06 - 0.10 kgCO2e/cup (avg 0.08 kgCO2e/cup)**
  *(Breakdown: Shade-grown picking 10–20g; Sun-drying 5–10g; LPG hand-roasting 30–45g; Manual grinding 0g; LPG boiling & drip 15–25g)*
- **Heritage Wood-Steamed Miang Making (เรียนรู้วิถีทำเหมี้ยงโบราณเตาฟืน โดย ลุงสมบัติ & ยายเขียว)**: **0.035 - 0.07 kgCO2e/bunch (avg 0.05 kgCO2e/bunch)**
  *(Breakdown: Hand-picking 0–5g; Dried fallen wood gathering & bamboo splitting 0–2g; Traditional wooden steamer & wood fire 30–60g [renewable biogenic carbon]; Bamboo tray air-cooling 0g; Bamboo-tied bunch with banana leaf packaging 2–5g)*


# MIANG MAP - Project Context

## Domain Model & Features

MIANG MAP is a community tourism platform for Ban Pa Miang (บ้านป่าเหมี้ยง) in Lampang, Thailand. It supports low-carbon tourism by allowing visitors to view, plan, and register their trips, then track their carbon footprint and engage in eco-friendly challenges while in the community.

### Travel Packages (Low Carbon Trips)
The platform offers pre-defined travel packages (e.g., Adventure, Foodie, Scenic) as well as a **Flexible Trip (ทริปอิสระตามใจคุณ)** option (ID: 99).
- **Flexible Trip Purpose**: For visitors who do not want to stick to a pre-defined itinerary, or are undecided about specific activities from the beginning. They can register this flexible trip first, and dynamically check off green/sustainable activities (Green Checklist) during their stay in the community to calculate actual carbon savings and earn rewards/privileges.

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

# 6. Align Platform with Field Research Data, Carbon Calculations, and Community Stories

Date: 2026-09-07
Status: Accepted

## Context
A comprehensive 18-page field research and community documentation for Ban Pa Miang was delivered, containing:
1. Authentic local stories and pioneers (Zhan Coffee by P'Khomsan, Tea Pillow Homestay by P'Sunee, Sai Chon Homestay by Mae Sai Chon, Nhan Nid bamboo weave craft, Lung Singhthong wild bee & herbal medicine, Homchooy Coffee by P'Waewdao, Heuan Sayphon by Khru Kung, Kritsana Thara Homestay by P'Ting, Por Hla village transition, Kon Bon Doi by P'Num, Pa Kham Dok Siew sausage, Lung Sombat & Yai Khiew steamed miang heritage, and Por Prasit 200-year village genesis).
2. Practical traveler safety and preparation guidance (warning on "Tua Kunt" / black flies, steep winding mountain roads requiring low gears and brake checks, cash necessity, warm clothes/rain gear, non-slip footwear, nocturnal peace).
3. Empirical Activity Carbon Calculations:
   - Tea pillow & tea doll workshop (0.70 kg CO₂e / item based on 5-6 kg CO₂e / kg cotton)
   - Agroforestry mixed garden tour (0.00 kg CO₂e - Zero Carbon walking)
   - Traditional Khan Tok 3-dish set (1.70 - 2.60 kg CO₂e / set, avg 0.85 kg CO₂e / person / meal with 4-item ingredient breakdown)
   - Complete lifecycle coffee workshop (60 - 100 g CO₂e / cup, avg 0.08 kg CO₂e / cup across 5 steps)
   - Heritage wood-steamed miang making (35 - 70 g CO₂e / bunch, avg 0.05 kg CO₂e / bunch across 5 steps)

Prior to this alignment, website pages had generic copy, rough carbon estimates, and lacked integration with these specific village pioneers and authentic carbon lifecycle data.

## Decision
We decided to systematically align the entire web platform with the field research document:

1. **Information Architecture & Cross-Navigation**:
   - `home/index.html`: Update 200-year history and royal project transition narratives; introduce "Voices of the Forest" pioneer showcase; introduce "Traveler's Field Guide" with a prominent Tua Kunt warning and 5-point mountain prep checklist.
   - `travel_package/`: Align Step 2 village activities with the exact 5 empirical research activities and carbon factors; add interactive "Carbon Breakdown" detail views displaying step-by-step lifecycle emissions.
   - `attraction/index.html` & `map/index.html`: Create a unified `community_stories.js` repository mapping locations to detailed profiles, quotes, signature dishes, and activities, ensuring full content displays even if database descriptions are null.

2. **Carbon Transparency**:
   - Provide visitors with transparent access to lifecycle factors (e.g., coffee bean roasting LPG vs. manual hand grinding 0g vs. boiling/drip) to foster genuine climate literacy.

3. **Community Pioneer Attribution**:
   - Attribute every activity and homestay directly to the local host (e.g., "Zhan Coffee by P'Khomsan", "Tea Pillow by P'Sunee", "Sai Chon by Mae Sai Chon") with direct map links and attraction detail links.

## Consequences
- The platform shifts from generic eco-tourism marketing to an authentic, scientifically grounded community narrative.
- Significant increase in traveler preparedness regarding high-elevation mountain road safety and insect bite prevention.
- High educational value through transparent carbon lifecycle breakdowns.
- Seamless, bidirectional discovery across Home, Map, Attraction, and Carbon Tracker pages.

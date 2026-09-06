// community_stories.js - ข้อมูลเรื่องเล่า บุคคลสำคัญ และภูมิปัญญาชุมชนบ้านป่าเหมี้ยง
// อ้างอิงจากเอกสารงานวิจัยและข้อมูลชุมชนบ้านป่าเหมี้ยง (ADR 0006)

const COMMUNITY_STORIES = {
    // 1. Zhan Coffee โดย พี่คมสันต์ (Map ID: 34)
    "34": {
        id: 34,
        key: "zhan_coffee",
        name: "Zhan Coffee (ซานคอฟฟี่)",
        host: "พี่คมสันต์",
        tagline: "ยกระดับกาแฟป่าเหมี้ยงจากศูนย์ สู่รสชาติเอกลักษณ์กลางผืนป่า",
        category: "food",
        categoryLabel: "☕ กาแฟ & โรงคั่วชุมชน",
        heroImage: "../home/images/wild_coffee.png",
        storyTh: `จากคนบ้านป่าเหมี้ยงโดยกำเนิดที่เริ่มต้นจากศูนย์และไม่มีความรู้เรื่องกาแฟมาก่อน พี่คมสันต์มุ่งมั่นศึกษาและพัฒนาเมล็ดกาแฟอาราบิกาในหมู่บ้าน เพื่อยกระดับผลผลิตท้องถิ่นให้มีมูลค่าเพิ่มขึ้น และสร้างรายได้กลับคืนสู่ชุมชนอย่างยั่งยืน เส้นทางของ Zhan Coffee เริ่มต้นจากศูนย์อย่างแท้จริง พี่คมสันต์ก้าวเข้าสู่วงการนี้โดยไม่มีพื้นฐานความรู้เรื่องกาแฟมาก่อน หากแต่อาศัยหัวใจที่ต้องการยกระดับกาแฟป่าเหมี้ยงให้มีคุณค่ามากกว่าการขายเมล็ดกาแฟดิบแบบดั้งเดิม

เขาลงมือศึกษา เรียนรู้ และทดลองอย่างจริงจังในทุกขั้นตอน ตั้งแต่การดูแลต้นกาแฟที่ปลูกร่วมกับผืนป่า การคัดเก็บผลเชอร์รี่สุก การแปรรูป ไปจนถึงเทคนิคการคั่ว เพื่อดึงเอกลักษณ์รสชาติเฉพาะตัวของดินแดนแห่งนี้ออกมาในทุกแก้ว การแวะจิบกาแฟที่ Zhan Coffee สักแก้ว จึงไม่ใช่เพียงการดื่มกาแฟคุณภาพดี แต่คือการสนับสนุนความตั้งใจของคนท้องถิ่นที่พาผลผลิตจากผืนป่าเหมี้ยงให้เติบโตอย่างยั่งยืน`,
        storyEn: `Born and raised in Ban Pa Miang with zero prior coffee background, P'Khomsan devoted himself to researching and developing local Arabica coffee beans. His mission was to elevate local agricultural produce into high-value specialty coffee and generate sustainable income for the community. Learning every step from shade-grown forest cultivation and ripe cherry harvesting to artisan roasting techniques, Zhan Coffee extracts the unique terroir of Pa Miang into every handcrafted cup.`,
        signatureHighlight: "เมล็ดกาแฟอาราบิกาอินทรีย์ปลูกใต้ร่มไม้ใหญ่ และการคั่วกาแฟแบบ Hand-roasted ดึงรสชาติตามธรรมชาติ",
        branches: [
            "สาขาป่าเหมี้ยง: ดื่มด่ำกาแฟสดท่ามกลางไอเย็นและขุนเขาในหมู่บ้าน",
            "สาขาข้าง 7-Eleven อำเภอเมืองปาน: จุดแวะเติมความสดชื่นริมทางก่อนขึ้นดอย",
            "กาดนั่งก้อม หนองกระทิง (เฉพาะวันเสาร์ - อาทิตย์): ลิ้มรสกาแฟป่าเหมี้ยงในบรรยากาศตลาดเช้าเมืองลำปาง"
        ],
        carbonFact: "เวิร์กช็อปกาแฟครบวงจรปล่อยคาร์บอนเพียง 0.08 kgCO2e ต่อแก้ว (60–100 g CO2e)"
    },

    // 2. หมอนใบชาโฮมสเตย์ โดย พี่สุนีย์ (Map ID: 46 ศูนย์เรียนรู้หมอนใบชา)
    "46": {
        id: 46,
        key: "morn_baicha",
        name: "หมอนใบชาโฮมสเตย์ & ศูนย์เรียนรู้หมอนใบชา",
        host: "พี่สุนีย์",
        tagline: "พักผ่อนริมธาร สัมผัสไอหมอก พร้อมเวิร์กช็อปงานคราฟต์กลิ่นใบชา",
        category: "stay",
        categoryLabel: "🏡 โฮมสเตย์ & งานคราฟต์ภูมิปัญญา",
        heroImage: "../home/images/pa_miang_tea.png",
        storyTh: `สำหรับใครที่มองหาการพักผ่อนริมลำธารใสและไอเย็นสดชื่น หมอนใบชาโฮมสเตย์ของพี่สุนีย์คือหนึ่งในพิกัดยอดฮิตที่นักเดินทางถามถึงมากที่สุด ที่นี่ต้อนรับอย่างอบอุ่นด้วยราคาที่เป็นกันเอง พร้อมเสิร์ฟอาหารรสชาติท้องถิ่นที่เลือกได้ถึง 3 เมนู

ไฮไลต์ที่พลาดไม่ได้คือการนำใบเหมี้ยง (ชาอัสสัมป่า) มาตากแห้งสร้างสรรค์เป็นหมอนใบชาเพื่อสุขภาพ ช่วยดูดซับกลิ่นอับ ให้กลิ่นหอมผ่อนคลาย ช่วยให้หลับสบาย และเปิดคลาสสอนทำตุ๊กตาชาสุดน่ารักฟรีสำหรับผู้เข้าพัก`,
        storyEn: `For travelers seeking serene relaxation beside crystal-clear mountain streams and cool mountain mist, Morn Bai Cha Homestay by P'Sunee is among the most sought-after destinations. Guests are welcomed warmly with reasonable pricing, home-cooked regional meals, and complimentary workshops crafting aromatic tea pillows and tea dolls made from forest-harvested Assam tea leaves.`,
        signatureHighlight: "เวิร์กช็อปทำหมอนใบชาหอมๆ & ตุ๊กตาใบชา (สอนฟรีสำหรับผู้เข้าพัก) และกิจกรรมเก็บใบเหมี้ยงสดจากต้น",
        carbonFact: "หมอนใบชาใช้วัสดุธรรมชาติปล่อยคาร์บอนเพียง 0.70 kgCO2e ต่อชิ้น (ตัวใบชาไม่ปล่อยคาร์บอน)"
    },

    // 3. สายชลโฮมสเตย์ & ป่าเหมี้ยงคอฟฟี่เฮาส์ โดย แม่สายชล (Map ID: 14)
    "14": {
        id: 14,
        key: "saichon_homestay",
        name: "สายชลโฮมสเตย์ & ป่าเหมี้ยงคอฟฟี่เฮาส์",
        host: "แม่สายชล",
        tagline: "มนต์เสน่ห์โฮมสเตย์รุ่นบุกเบิก อบอุ่นด้วยวัฒนธรรมล้านนาดั้งเดิม",
        category: "stay",
        categoryLabel: "🏡 โฮมสเตย์รุ่นบุกเบิก",
        heroImage: "../home/images/community_homestay.png",
        storyTh: `สัมผัสความอบอุ่นแบบดั้งเดิมที่ สายชลโฮมสเตย์ หนึ่งในโฮมสเตย์รุ่นแรกๆ ของบ้านป่าเหมี้ยงที่เปิดต้อนรับนักเดินทางมาตั้งแต่ปี 2547 โดยแม่สายชล พร้อมดูแลผู้มาเยือนด้วยอาหารตามสั่งรสฝีมือแม่ที่ปรุงสดใหม่เสิร์ฟถึงที่พัก

พร้อมสัมผัสประเพณีต้อนรับอันเปี่ยมความหมาย พิธีบายศรีสู่ขวัญ ผูกข้อมือรับขวัญ และเพลิดเพลินกับเสียงดนตรีสะล้อซอซึงพื้นเมืองล้านนา รวมถึงการเดินชมสวนเกษตรผสมผสาน สวนกาแฟ ต้นเหมี้ยงโบราณ และต้นอะโวคาโดในผืนป่า`,
        storyEn: `Experience authentic traditional warmth at Sai Chon Homestay, one of the pioneering homestays in Ban Pa Miang operating since 2004 by Mae Sai Chon. Guests enjoy freshly cooked home-style meals, traditional Lanna Bai Sri Su Kwan blessing rituals with live Salo-Sor-Seung folk music, and guided agroforestry walking tours through wild tea and avocado orchards.`,
        signatureHighlight: "พิธีบายศรีสู่ขวัญผูกข้อมือ & ดนตรีสะล้อซอซึง และเดินทัวร์สวนเกษตรผสมผสานในผืนป่า",
        carbonFact: "การเดินทัวร์สวนเกษตรผสมผสานไม่ใช้เชื้อเพลิง ปล่อยคาร์บอน 0.00 kgCO2e (Zero Carbon)"
    },

    // 4. กฤษณาธาราโฮมสเตย์ โดย พี่ติ๋ง (Map ID: 18)
    "18": {
        id: 18,
        key: "kritsanathara",
        name: "กฤษณาธาราโฮมสเตย์",
        host: "พี่ติ๋ง",
        tagline: "ขันโตกใบเหมี้ยงรสเด็ด หัวใจแห่งการต้อนรับที่เชื่อมโยงทั้งชุมชน",
        category: "stay",
        categoryLabel: "🏡 โฮมสเตย์ & สำรับขันโตก",
        heroImage: "../home/images/village.jpg",
        storyTh: `จากประสบการณ์ในรั้วโรงงาน สู่การสร้างสรรค์ กฤษณาธาราโฮมสเตย์ ที่เปิดต้อนรับนักเดินทางมานานกว่า 9 ปี โดย พี่ติ๋ง ผู้มีความตั้งใจอยากให้นักท่องเที่ยวได้สัมผัสเสน่ห์รอบหมู่บ้านอย่างทั่วถึง

พี่ติ๋งจึงพร้อมเป็นสะพานเชื่อมพานักท่องเที่ยวไปสัมผัสกิจกรรมของบ้านหลังอื่นๆ ในชุมชน ไฮไลต์สำคัญคือการจัดสำรับขันโตกพื้นบ้านสั่งทำพิเศษ ลิ้มรสเมนูเอกลักษณ์อย่าง ยำใบเหมี้ยง, ไส้อั่วใบเหมี้ยง และของหวานสูตรเฉพาะจากใบเหมี้ยง`,
        storyEn: `Transitioning from factory career experience, P'Ting established Kritsana Thara Homestay over 9 years ago. Driven by a passion to help visitors experience every corner of the village, P'Ting acts as a community bridge connecting guests to various home workshops. Renowned for authentic local Khan Tok sets featuring signature Yum Bai Miang and herbal tea leaf dishes.`,
        signatureHighlight: "สำรับขันโตกพื้นบ้านสั่งทำพิเศษ: ยำใบเหมี้ยง, ไส้อั่วใบเหมี้ยง และจัดคลาสสอนทำอาหารพื้นเมือง",
        carbonFact: "สำรับขันโตก 3 เมนู วัตถุดิบท้องถิ่น 0 กม. ปล่อยคาร์บอนเพียง ~0.85 kgCO2e ต่อคน (1.70–2.60 kgCO2e ทั้งสำรับ)"
    },

    // 5. คนบนดอยโฮมสเตย์ x คาเฟ่ โดย พี่หนุ่ม (Map ID: 20)
    "20": {
        id: 20,
        key: "konbondoihomestay",
        name: "คนบนดอยโฮมสเตย์ x คาเฟ่",
        host: "พี่หนุ่ม",
        tagline: "จากโปรแกรมเมอร์ IT สู่บ้านพักริมธารและวิถีคนทำกาแฟ",
        category: "stay",
        categoryLabel: "🏡 โฮมสเตย์ริมธาร & เวิร์กช็อปกาแฟ",
        heroImage: "../home/images/pamiangview.jpg",
        storyTh: `พี่หนุ่ม อดีตโปรแกรมเมอร์สาย IT ผู้ตัดสินใจผันตัวกลับบ้านเกิดเพื่อดูแลพ่อแม่ พร้อมริเริ่มเปิดโฮมสเตย์และคาเฟ่บรรยากาศอบอุ่นริมลำธาร ให้ผู้มาเยือนได้พักผ่อนและสัมผัสเสน่ห์กาแฟดอยอย่างลึกซึ้ง

ตัวบ้านพักริมน้ำสร้างเป็น 4 ชั้น จัดสรรพื้นที่เพียงชั้นละ 1 ทัวร์ เพื่อความเป็นส่วนตัว (Private) สูงสุดสำหรับผู้เข้าพัก (Check-in 14:00 น.) เสิร์ฟสำรับขันโตกพื้นบ้านต้นตำรับ ยำใบเหมี้ยงสั่งทำพิเศษ และจัดเวิร์กช็อปเปิดโลกกาแฟแบบครบวงจรพาชมตั้งแต่การปลูก เก็บเกี่ยว แปรรูป คั่วเมล็ดด้วยมือ และดริปดื่มสดๆ`,
        storyEn: `P'Num, a former software developer, made the life choice to return to his mountain hometown to care for his elderly parents, founding Kon Bon Doi Homestay and Cafe along the stream. Featuring a 4-story streamside lodge dedicated to one group per floor for maximum privacy, authentic Khan Tok meals, and complete seed-to-cup coffee processing workshops.`,
        signatureHighlight: "บ้านพักริมน้ำ 4 ชั้น Private ชั้นละ 1 ทัวร์ และเวิร์กช็อปเปิดโลกกาแฟครบวงจร (เก็บ คั่ว ดริปสด)",
        carbonFact: "เวิร์กช็อปทำกาแฟดื่มสด 1 แก้ว ปล่อยคาร์บอนเพียง 60–100 g CO2e (0.08 kgCO2e)"
    },

    // 6. หอมฉุย Coffee โดย พี่แววดาว (Map ID: 36)
    "36": {
        id: 36,
        key: "homchooy_coffee",
        name: "หอมฉุย Coffee กาแฟบ้านป่าเหมี้ยง",
        host: "พี่แววดาว",
        tagline: "กรุ่นกลิ่นกาแฟจากสวนป่า ผลผลิตคุณภาพเพื่อชุมชนอย่างแท้จริง",
        category: "food",
        categoryLabel: "☕ กาแฟอินทรีย์วนเกษตร",
        heroImage: "../home/images/wild_coffee.png",
        storyTh: `หอมฉุย Coffee ก่อตั้งขึ้นจากความตั้งใจของ พี่แววดาว ผู้ปลูกและดูแลสวนกาแฟอาราบิกาใต้ร่มเงาไม้ใหญ่ เมื่อถึงฤดูเก็บเกี่ยว ผลผลิตเมล็ดกาแฟจะถูกส่งต่อไปคั่วอย่างพิถีพิถันที่โรงคั่วของพี่คมสันต์ในหมู่บ้าน

นอกจากนี้ยังเป็นสมาชิกผลผลิตโครงการหลวง (70%) ที่ช่วยสร้างรายได้ที่มั่นคงกลับคืนสู่ท้องถิ่น ของฝากแนะนำได้แก่ กาแฟคั่วสดหอมฉุย, ใบชาคุณภาพ และน้ำผึ้งป่าธรรมชาติ`,
        storyEn: `Founded by P'Waewdao, Homchooy Coffee cultivates Arabica coffee beneath tall canopy trees. During harvest, ripe cherries are sent for meticulous artisan roasting at P'Khomsan's community roastery. As a 70% Royal Project supplier, it generates reliable local livelihoods while preserving forest biodiversity.`,
        signatureHighlight: "กาแฟคั่วสดหอมฉุย, ใบชาคุณภาพ และน้ำผึ้งป่าธรรมชาติแท้จากผืนป่า",
        carbonFact: "ระบบเกษตรใต้ร่มไม้ใหญ่ (Shade-grown) ดูดซับคาร์บอนและปกป้องผืนป่าต้นน้ำ"
    },

    // 7. ศาสตร์แห่งการนึ่งเหมี้ยงโบราณ โดย ลุงสมบัติ และ ยายเขียว (Map ID: 48 ศูนย์เรียนรู้เหมี้ยงหมัก)
    "48": {
        id: 48,
        key: "ancient_miang_steaming",
        name: "ศูนย์เรียนรู้วิถีนึ่งเหมี้ยงโบราณเตาฟืน",
        host: "ลุงสมบัติ และ ยายเขียว",
        tagline: "เปิดแหล่งเรียนรู้วิถีทำเหมี้ยงดั้งเดิม มรดกภูมิปัญญาที่ส่งต่อมารุ่นสู่รุ่น",
        category: "other",
        categoryLabel: "🍃 มรดกภูมิปัญญาล้านนา",
        heroImage: "../home/images/pa_miang_tea.png",
        storyTh: `ลุงสมบัติและยายเขียว เปิดสวนและเรือนเหมี้ยงให้เป็นแหล่งเรียนรู้วิถีการทำเหมี้ยงแบบโบราณที่ทำสืบต่อกันมายาวนาน นักท่องเที่ยวจะได้สัมผัสทุกกระบวนการอย่างใกล้ชิด

ตั้งแต่การเก็บใบเหมี้ยงจากต้นในป่า การจักตอกไม้ไผ่ การนึ่งด้วยไหไม้และเตาฟืนดั้งเดิม การนำเหมี้ยงที่นึ่งสุกแล้วมาเทผึ่งลดอุณหภูมิ ก่อนจะรวบเรียงเป็นกำอย่างประณีตแล้วใช้ตอกมัด เพื่อเตรียมนำไปหมักและส่งออกไปจำหน่ายยังตัวเมือง เป็นมรดกทางวัฒนธรรมที่สืบทอดมากว่า 200 ปี`,
        storyEn: `Lung Sombat and Yai Khiew welcome visitors to their traditional miang house, demonstrating living cultural heritage passed down over two centuries. Visitors learn traditional tea leaf picking, bamboo strip splitting, steaming with hand-carved wooden steamers over firewood, natural air cooling on bamboo trays, and delicate hand bundling with bamboo ties.`,
        signatureHighlight: "สาธิตการจักตอกไม้ไผ่, การนึ่งเหมี้ยงด้วยไหไม้เตาฟืนดั้งเดิม และการมัดกำใบตองตึง",
        carbonFact: "เหมี้ยงโบราณ 1 กำ ปล่อยคาร์บอนเพียง 35–70 g CO2e (0.05 kgCO2e) โดยฟืนเก็บจากกิ่งไม้แห้งร่วงหล่นเป็นคาร์บอนชีวภาพหมุนเวียน"
    },

    // 8. ศูนย์เรียนรู้ชุมชนบ้านป่าเหมี้ยง โดย พ่อประสิทธิ์ & พ่อหล้า (Map ID: 45)
    "45": {
        id: 45,
        key: "community_center_history",
        name: "ศูนย์เรียนรู้ชุมชนบ้านป่าเหมี้ยง (ประวัติศาสตร์ 200 ปี)",
        host: "พ่อประสิทธิ์ & พ่อหล้า",
        tagline: "ย้อนรอย 200 ปี จากชุมชนอพยพหลบภัย สู่ร่มเงาโครงการหลวงและการท่องเที่ยวเชิงนิเวศ",
        category: "other",
        categoryLabel: "🏛️ ประวัติศาสตร์ & วัฒนธรรม",
        heroImage: "../home/images/village.jpg",
        storyTh: `ย้อนเวลากลับไปกว่า 200 ปีก่อน บรรพบุรุษบ้านป่าเหมี้ยงได้อพยพมาจากตำบลแจ้ซ้อนและพื้นที่ใกล้เคียง เพื่อหนีภัยสงครามและการเก็บส่วยภาษี (ภาษี 4 บาทในสมัยนั้น) เข้ามาตั้งถิ่นฐานกลางหุบเขาและริเริ่มทำกินด้วยการเก็บ "ชาและเหมี้ยง" นำมานึ่งและหมักเป็นของเคี้ยวหลังอาหารตามวัฒนธรรมล้านนา (เล่าโดย พ่อประสิทธิ์)

ต่อมาในยุคเปลี่ยนผ่าน โครงการหลวงได้ก้าวเข้ามามีบทบาทสำคัญ ส่งเสริมการปลูกชาและกาแฟอาราบิกา จนกลายมาเป็นพืชเศรษฐกิจหลักที่สร้างรายได้อย่างมั่นคงยั่งยืน และชุมชนริเริ่มเปิด "โฮมสเตย์ 2–3 หลังแรก" โดยมี พ่อหล้า หนึ่งในคณะกรรมการหมู่บ้านรุ่นบุกเบิก คอยทำหน้าที่เป็นที่ปรึกษาและส่งต่อภูมิปัญญาแก่คนรุ่นใหม่`,
        storyEn: `Tracing back over 200 years, ancestors of Ban Pa Miang migrated from Chae Son to evade wartime conflicts and tax levies (a 4-baht tax at the time), settling deep in this highland valley. They sustained their lives by harvesting wild tea leaves, steaming and fermenting them into traditional Lanna chewable miang. Later, the Royal Project introduced shade-grown Arabica coffee, transforming the village into a thriving low-carbon eco-tourism community guided by village elders Por Prasit and Por Hla.`,
        signatureHighlight: "นิทรรศการประวัติศาสตร์ 200 ปี, รากเหง้าภูมิปัญญาเหมี้ยงโบราณ และการเปลี่ยนผ่านสู่การท่องเที่ยวเชิงนิเวศ",
        carbonFact: "ผืนป่าต้นน้ำบ้านป่าเหมี้ยงกักเก็บคาร์บอนได้มหาศาลผ่านระบบวนเกษตรกาแฟและชาใต้ร่มไม้ใหญ่"
    },

    // 9. หัตถศิลป์สานตอกวิถีป่าเหมี้ยง โดย หนานนิด (Living Heritage)
    "nhan_nid": {
        id: "nhan_nid",
        key: "nhan_nid_craft",
        name: "หัตถศิลป์สานตอกวิถีป่าเหมี้ยง",
        host: "หนานนิด",
        tagline: "ความเพียรในเส้นตอก สู่ที่ใส่แก้วทำมือจากหัวใจช่างฝีมือ",
        category: "other",
        categoryLabel: "🎋 งานจักสานหัตถศิลป์รักษ์โลก",
        heroImage: "../home/images/pa_miang_tea.png",
        storyTh: `อีกหนึ่งเสน่ห์เล็กๆ ที่พบได้ในหมู่บ้าน คือภาพของ หนานนิด ที่นั่งจักสานเส้นตอกไม้ไผ่อย่างประณีตบรรจงเพื่อทำเป็น "ที่ใส่แก้วน้ำรักษ์โลก" ส่งให้ลูกหลานนำไปจำหน่าย

จากตอกราคากิโลกรัมละ 40 บาท ผ่านสองมือและสมาธิ ออกมาเป็นงานสานชิ้นละ 80 สตางค์ เป็นวิถีชีวิตเรียบง่ายที่สะท้อนถึงคุณค่าแห่งความพยายามและงานหัตถกรรมพื้นบ้านที่น่าแวะมาชมและร่วมอุดหนุน`,
        storyEn: `A quiet gem in the village is the sight of Nhan Nid patiently splitting bamboo into fine strips and weaving eco-friendly cup holders. Turning raw bamboo into handcrafted utility pieces, his craft exemplifies mindfulness, perseverance, and authentic village sustainability.`,
        signatureHighlight: "ที่ใส่แก้วน้ำไม้ไผ่รักษ์โลก และงานจักสานตอกด้วยมือ 100%",
        carbonFact: "บรรจุภัณฑ์ไม้ไผ่ทดแทนพลาสติกแบบใช้ครั้งเดียวทิ้ง ช่วยลดขยะและลดคาร์บอนได้โดยตรง"
    },

    // 10. ศาสตร์แห่งผึ้งป่าและสมุนไพร โดย ลุงสิงห์ทอง (Living Heritage)
    "lung_singhthong": {
        id: "lung_singhthong",
        key: "lung_singhthong_honey",
        name: "ศาสตร์แห่งผึ้งป่าและสมุนไพร",
        host: "ลุงสิงห์ทอง",
        tagline: "ภูมิปัญญาคนตีผึ้งกลางสวนผสม สู่โอสถธรรมชาติตำรับสุขภาพ",
        category: "other",
        categoryLabel: "🐝 น้ำผึ้งป่า & สมุนไพรโอสถ",
        heroImage: "../home/images/village.jpg",
        storyTh: `ลุงสิงห์ทอง ปราชญ์ชาวบ้านผู้คลุกคลีกับการ "ตีผึ้ง" มาอย่างยาวนาน ออกเดินทางเข้าไปเก็บน้ำผึ้งจาก ผึ้งโพรง และ ชันโรง ในสวนกาแฟ ชา และอะโวคาโด

นำน้ำผึ้งป่าบริสุทธิ์มาแปรรูปเป็น "ยาลูกกลอนสมุนไพร" ที่ขึ้นชื่อเรื่องสรรพคุณบำรุงร่างกาย (เหมาะสำหรับผู้รักสุขภาพและผู้ป่วยพักฟื้น) นอกจากนี้นักท่องเที่ยวยังสามารถแวะไปชิมอาหารตามสั่งรสเด็ดจากฝีมือภรรยาของลุงสิงห์ทอง และเลือกซื้อผลิตภัณฑ์จากผึ้งและชันโรงแท้`,
        storyEn: `Lung Singhthong, a local elder and traditional beekeeper, harvests pure honey from wild and stingless bees (Stingless Bee / Chan Rong) within agroforestry tea and coffee orchards, crafting herbal honey bolus medicine for health restoration alongside home-cooked meals by his wife.`,
        signatureHighlight: "น้ำผึ้งป่าเดือนห้าแท้, น้ำผึ้งชันโรง และยาลูกกลอนสมุนไพรบำรุงสุขภาพ",
        carbonFact: "การเลี้ยงผึ้งและชันโรงช่วยผสมเกสรพืชป่า รักษาความสมบูรณ์ของระบบนิเวศโดยไม่ปล่อยมลพิษ"
    },

    // 11. ไส้อั่วดอกเสี้ยว & อาหารถิ่นตามฤดูกาล โดย ป้าคำ (Living Heritage)
    "pa_kham": {
        id: "pa_kham",
        key: "pa_kham_sausage",
        name: "ไส้อั่วดอกเสี้ยว & อาหารถิ่นตามฤดูกาล",
        host: "ป้าคำ",
        tagline: "ภูมิปัญญาบนจานอาหาร มนต์เสน่ห์แห่งเทศกาลดอกเสี้ยวบาน",
        category: "food",
        categoryLabel: "🌸 อาหารถิ่นตามฤดูกาล",
        heroImage: "../home/images/pamiangview.jpg",
        storyTh: `หนึ่งในไฮไลต์รสชาติประจำถิ่นที่ต้องลิ้มลองในช่วงเทศกาลดอกเสี้ยวบานสะพรั่ง คือ "ไส้อั่วดอกเสี้ยว" ฝีมือ ป้าคำ ที่นำกลีบดอกเสี้ยวป่ามาผสมผสานกับเนื้อหมูและเครื่องแกง ให้กลิ่นหอมเฉพาะตัวและมีรสสัมผัสฝาดละมุนปลายลิ้นตามธรรมชาติ

นอกจากนี้ยังมี "ดอกเสี้ยวทอดกรอบ" ของทานเล่นกรุบกรอบรสเลิศ ที่สะท้อนภูมิปัญญาการนำดอกไม้ป่ามารังสรรค์เป็นอาหารได้อย่างลงตัว`,
        storyEn: `During the seasonal blooming of white Bauhinia (Dok Siew) blossoms, Pa Kham crafts her celebrated 'Dok Siew Herbal Sausage', blending wild edible blossoms with aromatic herbs and northern spices, alongside crispy fried Dok Siew snack delicacies.`,
        signatureHighlight: "ไส้อั่วดอกเสี้ยวป่าหอมเครื่องแกง และดอกเสี้ยวทอดกรอบ",
        carbonFact: "ใช้วัตถุดิบดอกไม้ป่าตามฤดูกาล (Zero Food Miles) ไม่ต้องพึ่งพาสารเคมีหรือการขนส่งทางไกล"
    },

    // 12. เฮือนเสพลโฮมสเตย์ โดย ครูกุ่ง (Living Heritage)
    "heuan_sayphon": {
        id: "heuan_sayphon",
        key: "heuan_sayphon_homestay",
        name: "เฮือนเสพลโฮมสเตย์",
        host: "ครูกุ่ง",
        tagline: "มุมสงบบนเนินสูง พักผ่อนกายใจและเดินทอดน่องชมวิถีชุมชน",
        category: "stay",
        categoryLabel: "🏡 ที่พักวิวเนินสูง",
        heroImage: "../home/images/community_homestay.png",
        storyTh: `สำหรับนักเดินทางที่ต้องการความเงียบสงบและหลีกหนีความวุ่นวาย เฮือนเสพลโฮมสเตย์ของครูกุ่ง เป็นที่พักบนเส้นทางเนินสูงที่เปิดรับลมเย็นและวิวหมู่บ้านได้อย่างสบายตา

เหมาะสำหรับการพักผ่อนชาร์จพลัง พร้อมออกเดินลัดเลาะเที่ยวชมวิถีชีวิตรอบหมู่บ้านป่าเหมี้ยงได้อย่างสะดวกสบาย และเชื่อมโยงมื้ออาหารแสนอร่อยที่กฤษณาธาราโฮมสเตย์`,
        storyEn: `Nestled on an elevated ridge overlooking the peaceful village valley, Heuan Sayphon Homestay by Khru Kung offers a serene retreat embracing crisp mountain breezes, scenic hillside viewpoints, and leisurely walking paths through the village.`,
        signatureHighlight: "จุดชมวิวหมู่บ้านมุมสูง, บรรยากาศเงียบสงบเป็นส่วนตัว และลมธรรมชาติเย็นตลอดปี",
        carbonFact: "ใช้ความเย็นจากลมธรรมชาติบนเนินสูง 100% ไร้เครื่องปรับอากาศ"
    }
};

// Helper function: ค้นหาเรื่องเล่าจาก ID หรือ Key
function getCommunityStory(idOrKey) {
    if (!idOrKey) return null;
    const strId = String(idOrKey);
    if (COMMUNITY_STORIES[strId]) {
        return COMMUNITY_STORIES[strId];
    }
    // ค้นหาตาม key หรือชื่อ host
    for (const key in COMMUNITY_STORIES) {
        const item = COMMUNITY_STORIES[key];
        if (item.key === strId || item.host.includes(strId)) {
            return item;
        }
    }
    return null;
}

// รายชื่อบุคคลสำคัญทั้งหมดสำหรับแสดงในหน้าแรก (Home Showcase)
function getAllCommunityPioneers() {
    return Object.values(COMMUNITY_STORIES);
}

// ข้อมูลคู่มือการเตรียมตัวและคำเตือนตัวคุ่น (Traveler's Field Guide) หน้า 15
const TRAVELER_FIELD_GUIDE = {
    warning: {
        title: "คำเตือนสำคัญ: แมลงป่าและ 'ตัวคุ่น' (ริ้นดำ)",
        description: "เนื่องจากบ้านป่าเหมี้ยงอุดมสมบูรณ์ไปด้วยป่าไม้และลำธารน้ำใส จึงเป็นแหล่งอาศัยตามธรรมชาติของแมลงป่า โดยเฉพาะ 'ตัวคุ่น' (ริ้นดำ) ซึ่งมีขนาดเล็กมากจนแทบมองไม่เห็น เมื่อกัดมักไม่รู้สึกเจ็บในทันที แต่จะทำให้เกิดตุ่มแดง คันมาก และเป็นรอยนาน",
        tips: [
            { icon: "👕", title: "สวมเสื้อผ้าให้มิดชิด", desc: "แนะนำให้ใส่เสื้อแขนยาว กางเกงขายาว และถุงเท้า โดยเฉพาะเวลาเดินเลียบน้ำ ป่ากาแฟ หรือเส้นทางเดินธรรมชาติ" },
            { icon: "🧴", title: "พกสเปรย์กันยุงและกันคุ่น", desc: "เลือกใช้สเปรย์หรือโลชั่นกันยุงที่มีส่วนผสมของ DEET หรือน้ำมันยูคาลิปตัสเลมอน (Eucalyptus Lemon) ทาซ้ำทุก 2–3 ชั่วโมง" },
            { icon: "💊", title: "เตรียมยาทารักษาอาการคัน", desc: "พกยาทาแก้แพ้ แก้คัน หรือยาหม่องติดตัว หากถูกกัดให้หลีกเลี่ยงการเกาเพื่อป้องกันแผลติดเชื้อ" }
        ]
    },
    checklist: [
        {
            icon: "🚗",
            title: "การเดินทางและยานพาหนะ",
            desc: "เส้นทางขึ้นบ้านป่าเหมี้ยงเป็นทางขึ้นเขาลาดชันและมีโค้งแคบ ควรตรวจเช็กสภาพเบรกและยางรถให้พร้อม ผู้ขับขี่ควรใช้เกียร์ต่ำและขับขี่ด้วยความระมัดระวัง รวมถึงเติมน้ำมันรถให้เต็มถังก่อนขึ้นดอย"
        },
        {
            icon: "💵",
            title: "เตรียมเงินสดสำรอง",
            desc: "สัญญาณอินเทอร์เน็ตบนดอยอาจไม่เสถียรในบางจุด และร้านค้าชุมชนส่วนใหญ่ยังเน้นรับเงินสด แนะนำให้กดเงินสดสำรองไว้ล่วงหน้า"
        },
        {
            icon: "🧥",
            title: "เสื้อกันหนาวและอุปกรณ์กันฝน",
            desc: "สภาพอากาศบนดอยเย็นสบายตลอดปีและจะหนาวเย็นเป็นพิเศษในตอนค่ำ ควรเตรียมเสื้อกันหนาวติดไปด้วย รวมถึงร่มหรือเสื้อกันฝนหากเดินทางช่วงฤดูฝน"
        },
        {
            icon: "👟",
            title: "รองเท้าสำหรับเดินลุย",
            desc: "หมู่บ้านมีทางเดินเนินสูงและเส้นทางศึกษาธรรมชาติ แนะนำให้สวมรองเท้าผ้าใบหรือรองเท้าเดินป่าที่กระชับ ไม่ลื่น"
        },
        {
            icon: "🕊️",
            title: "เคารพความสงบของชุมชน",
            desc: "ป่าเหมี้ยงเป็นหมู่บ้านวิถีชีวิตดั้งเดิมที่เงียบสงบ งดส่งเสียงดังยามวิกาล และช่วยกันรักษาความสะอาดด้วยการไม่ทิ้งขยะตามเส้นทางธรรมชาติ"
        }
    ]
};

// ส่งออกหากรันใน Node.js สภาพแวดล้อมทดสอบ
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COMMUNITY_STORIES,
        getCommunityStory,
        getAllCommunityPioneers,
        TRAVELER_FIELD_GUIDE
    };
}

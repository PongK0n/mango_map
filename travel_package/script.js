// script.js - Low Carbon Activity Tracker & Interactive Carbon Calculator
// Community Tourism Platform for Ban Pa Miang (บ้านป่าเหมี้ยง)

// Completely client-side zero-friction activity tracker with localStorage persistence

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// -------------------------------------------------------------
// 1. Data Configuration (aligned with TGO & 2006 IPCC Guidelines in CONTEXT.md)
// -------------------------------------------------------------

const ACTIVITIES_CONFIG = {
    // Step 1: Inbound Transportation (Lampang <-> Pa Miang round trip 160 km)
    transport: [
        {
            id: 'car',
            title: '🚗 รถยนต์ส่วนตัว (น้ำมัน)',
            subtitle: 'เครื่องยนต์เบนซิน/ดีเซล ไป-กลับ 160 กม. (ค่าเฉลี่ยปล่อยก๊าซพื้นฐาน)',
            emission: 43.15,
            unit: 'kgCO2e/คน',
            type: 'emission',
            icon: '🚗'
        },
        {
            id: 'ev',
            title: '⚡ รถยนต์ไฟฟ้า (EV)',
            subtitle: 'ชาร์จไฟฟ้ากริดไทย ไป-กลับ 160 กม. (ลดลง ~64% เทียบกับรถน้ำมัน)',
            emission: 15.52,
            unit: 'kgCO2e/คน',
            type: 'emission',
            icon: '⚡'
        },
        {
            id: 'van',
            title: '🛻 รถโดยสารชุมชน / สองแถว',
            subtitle: 'เดินทางร่วมกันอย่างน้อย 5 คน ช่วยแชร์การปล่อยคาร์บอนต่อคนได้ต่ำที่สุด',
            emission: 8.60,
            unit: 'kgCO2e/คน',
            type: 'emission',
            icon: '🛻',
            default: true
        }
    ],

    // Step 2: Village Activities & Stay (Empirical Field Research Data - ADR 0006)
    village: [
        {
            id: 'tea_craft',
            title: '🧵 เวิร์กช็อปหมอนใบชา & ตุ๊กตาชา (พี่สุนีย์)',
            subtitle: 'นำใบเหมี้ยงตากแห้งสร้างสรรค์เป็นหมอนใบชาสุขภาพ & ตุ๊กตาชา (หมอนใบชาโฮมสเตย์)',
            emission: 0.70,
            unit: 'kgCO2e/ชิ้น',
            type: 'emission',
            icon: '🧵',
            host: 'พี่สุนีย์ (หมอนใบชาโฮมสเตย์)',
            mapId: 46,
            breakdown: {
                title: 'การแจกแจงคาร์บอน: เวิร์กช็อปหมอนใบชา & ตุ๊กตาชา',
                source: 'เอกสารผลประเมินคาร์บอนกิจกรรมชุมชนบ้านป่าเหมี้ยง หน้า 16',
                steps: [
                    { step: '1. การเก็บใบเหมี้ยงในสวน & ตากแห้ง', detail: 'ใบเหมี้ยง (ชาอัสสัมป่า) ตากแดดธรรมชาติ ไม่ปล่อยคาร์บอน', emission: '0.00 kg CO₂e' },
                    { step: '2. การบรรจุไส้หมอนเข้าถุงผ้าฝ้าย', detail: 'ผ้าฝ้าย 1 กิโลกรัม ปล่อย 1.5 - 3.5 kg CO₂e, ผ่านการตัดเย็บและขนส่งเป็น 5 - 6 kg CO₂e', emission: 'คำนวณตามน้ำหนัก' },
                    { step: '3. ปริมาณผ้าฝ้ายต่อชิ้นงาน (~120 กรัม)', detail: 'หมอนใบชาและตุ๊กตาชาทำมือ 1 ชิ้น', emission: '~0.70 kg CO₂e / ชิ้น' }
                ],
                total: '0.70 kg CO₂e ต่อชิ้น'
            }
        },
        {
            id: 'garden_walk',
            title: '🚶‍♂️ เดินทัวร์สวนเกษตรผสมผสาน (แม่สายชล)',
            subtitle: 'เดินเท้าชมสวนกาแฟ ต้นเหมี้ยงโบราณ และต้นอะโวคาโดในผืนป่า (สายชลโฮมสเตย์)',
            emission: 0.00,
            unit: 'kgCO2e (Zero Carbon)',
            type: 'emission',
            icon: '🚶‍♂️',
            host: 'แม่สายชล (สายชลโฮมสเตย์)',
            mapId: 14,
            breakdown: {
                title: 'การแจกแจงคาร์บอน: เดินทัวร์สวนเกษตรผสมผสาน',
                source: 'เอกสารผลประเมินคาร์บอนกิจกรรมชุมชนบ้านป่าเหมี้ยง หน้า 16',
                steps: [
                    { step: '1. เดินเท้าจากโฮมสเตย์ไปสวน', detail: 'เดินรับความรู้และเก็บเกี่ยวผลผลิต ไร้การใช้เชื้อเพลิง 100%', emission: '0.00 kg CO₂e' }
                ],
                total: '0.00 kg CO₂e (Zero Carbon Activity)'
            }
        },
        {
            id: 'local_food',
            title: '🍲 สำรับขันโตกพื้นบ้าน 3 เมนู (พี่ติ๋ง / พี่หนุ่ม)',
            subtitle: 'น้ำพริกหนุ่มผักนึ่ง แกงแคไก่บ้าน ยำใบเหมี้ยง ข้าวเหนียวอินทรีย์ห่อใบตอง',
            emission: 0.85,
            unit: 'kgCO2e/คน/มื้อ',
            type: 'emission',
            icon: '🍲',
            host: 'พี่ติ๋ง (กฤษณาธารา) & พี่หนุ่ม (คนบนดอย)',
            mapId: 18,
            breakdown: {
                title: 'การแจกแจงคาร์บอน: สำรับขันโตกอาหารพื้นบ้าน (เฉลี่ยทาน 2-3 คน)',
                source: 'เอกสารผลประเมินคาร์บอนกิจกรรมชุมชนบ้านป่าเหมี้ยง หน้า 16',
                steps: [
                    { step: '1. น้ำพริกหนุ่ม + ผักนึ่ง', detail: 'พริก หอม กระเทียมปลูกเอง, ผักริมรั้ว/ผักป่า (Food Mile = 0)', emission: '0.25 – 0.40 kg CO₂e' },
                    { step: '2. แกงแคไก่บ้าน', detail: 'ไก่บ้านเลี้ยงปล่อยตามธรรมชาติ (เนื้อ ~150-200g) + ผักพื้นบ้าน', emission: '0.80 – 1.20 kg CO₂e' },
                    { step: '3. ยำใบเหมี้ยงสมุนไพร', detail: 'ใบเหมี้ยงสดเก็บจากดอย + ถั่วลิสงคั่ว + ปลาย่างรมควัน', emission: '0.30 – 0.50 kg CO₂e' },
                    { step: '4. ข้าวเหนียวอินทรีย์ + เชื้อเพลิง', detail: 'ข้าวเหนียวอินทรีย์ห่อใบตอง + ก๊าซหุงต้ม', emission: '0.35 – 0.50 kg CO₂e' }
                ],
                total: '~1.70 – 2.60 kg CO₂e ต่อ 1 สำรับ (เฉลี่ยต่อคนต่อมื้อ = ~0.85 kg CO₂e)'
            }
        },
        {
            id: 'forest_coffee',
            title: '☕ เวิร์กช็อปเปิดโลกกาแฟครบวงจร (พี่หนุ่ม / พี่คมสันต์)',
            subtitle: 'สัมผัสการทำกาแฟตั้งแต่เก็บผลสุก คั่วมือเตาแก๊ส บดมือ และดริปสด (คนบนดอย / Zhan)',
            emission: 0.08,
            unit: 'kgCO2e/แก้ว',
            type: 'emission',
            icon: '☕',
            host: 'พี่หนุ่ม (คนบนดอย) & พี่คมสันต์ (Zhan Coffee)',
            mapId: 20,
            breakdown: {
                title: 'การแจกแจงคาร์บอน: เวิร์กช็อปทำกาแฟดื่มสด 1 แก้ว',
                source: 'เอกสารผลประเมินคาร์บอนกิจกรรมชุมชนบ้านป่าเหมี้ยง หน้า 17',
                steps: [
                    { step: '1. การเก็บผลกาแฟ & ปลูก', detail: 'เก็บมือในสวนใต้ร่มไม้ป่า (Zero-mile, ปุ๋ยอินทรีย์, ไม่มีเครื่องจักร)', emission: '10 – 20 g CO₂e' },
                    { step: '2. การแปรรูปเบื้องต้น & ตาก', detail: 'ปอกเปลือก ล้างน้ำธรรมชาติ ตากแดดบนแคร่ไม้ไผ่ (พลังงานแสงอาทิตย์)', emission: '5 – 10 g CO₂e' },
                    { step: '3. การคั่วด้วยเครื่องคั่วมือ + เตาแก๊ส', detail: 'ใช้ก๊าซ LPG ประมาณ 10–15 กรัม ต่อการคั่ว 1 รอบ (10–15 นาที)', emission: '30 – 45 g CO₂e' },
                    { step: '4. การบดเมล็ดกาแฟ', detail: 'ใช้เครื่องบดมือ (Manual Hand Grinder ใช้พลังงานคน)', emission: '0 g CO₂e' },
                    { step: '5. การต้มน้ำ & ดริปสกัด', detail: 'ต้มน้ำร้อน 250–300 ml ด้วยเตาแก๊ส LPG + กระดาษกรองดริป', emission: '15 – 25 g CO₂e' }
                ],
                total: '~60 – 100 g CO₂e ต่อแก้ว (เฉลี่ย 0.08 kg CO₂e)'
            }
        },
        {
            id: 'ancient_miang',
            title: '🍃 วิถีการทำเหมี้ยงโบราณเตาฟืน (ลุงสมบัติ & ยายเขียว)',
            subtitle: 'ชมการจักตอก นึ่งเหมี้ยงด้วยไหไม้และเตาฟืน ผึ่งลม และมัดกำส่งขาย',
            emission: 0.05,
            unit: 'kgCO2e/กำ',
            type: 'emission',
            icon: '🍃',
            host: 'ลุงสมบัติ & ยายเขียว (ศูนย์เรียนรู้เหมี้ยงโบราณ)',
            mapId: 48,
            breakdown: {
                title: 'การแจกแจงคาร์บอน: เหมี้ยงโบราณพร้อมขาย (1 กำ)',
                source: 'เอกสารผลประเมินคาร์บอนกิจกรรมชุมชนบ้านป่าเหมี้ยง หน้า 18',
                steps: [
                    { step: '1. เก็บเกี่ยวยอดเหมี้ยงในป่า', detail: 'เก็บมือจากต้นชาป่าอัสสัม (ระบบวนเกษตร Zero-mile ไม่ใช้ปุ๋ยเคมี/เครื่องจักร)', emission: '0 – 5 g CO₂e' },
                    { step: '2. เตรียมฟืนและตอกไม้ไผ่', detail: 'เก็บกิ่งไม้แห้งร่วงหล่นในป่า + จักตอกไม้ไผ่ในชุมชน (แรงงานคน 100%)', emission: '0 – 2 g CO₂e' },
                    { step: '3. นึ่งด้วยไหไม้และเตาฟืน', detail: 'เผาไหม้ฟืนไม้แห้ง นึ่งรอบละ 15–30 กำพร้อมกัน (คาร์บอนชีวภาพหมุนเวียน)', emission: '30 – 60 g CO₂e' },
                    { step: '4. การผึ่ง พักเย็น และคัดแยก', detail: 'เทกระจายบนกระด้งไม้ไผ่ ผึ่งลมธรรมชาติเพื่อคลายความร้อน', emission: '0 g CO₂e' },
                    { step: '5. การจับเรียงมัดกำด้วยตอก', detail: 'ใช้มือจับเรียงใบ มัดด้วยตอกไม้ไผ่ และห่อด้วยใบตองตึง/ใบตอง (Biomass packaging)', emission: '2 – 5 g CO₂e' }
                ],
                total: '~35 – 70 g CO₂e ต่อกำ (เฉลี่ย 0.05 kg CO₂e)'
            }
        },
        {
            id: 'homestay',
            title: '🏡 พักค้างคืนโฮมสเตย์ชุมชน',
            subtitle: 'พักผ่อนในโฮมสเตย์ประหยัดพลังงาน พัดลมธรรมชาติ + หลอดไฟ LED (8 ชม.)',
            emission: 0.16,
            unit: 'kgCO2e/คน/คืน',
            type: 'emission',
            icon: '🏡'
        },
        {
            id: 'kiufin_truck',
            title: '🌄 รถกระบะชุมชนขึ้นชมวิวดอยกิ่วฝิ่น',
            subtitle: 'นั่งรถกระบะชาวบ้านขึ้นชมแสงแรกและทะเลหมอก 3 จังหวัด (ระยะทาง 10 กม.)',
            emission: 2.70,
            unit: 'kgCO2e/เที่ยว',
            type: 'emission',
            icon: '🌄'
        }
    ],

    // Step 3: Green Actions & Offsets (Voluntary sustainable behaviors)
    offsets: [
        {
            id: 'tumbler',
            title: '🥤 พกกระบอกน้ำ / กล่องอาหารส่วนตัว',
            subtitle: 'ปฏิเสธแก้วและขวดพลาสติกแบบใช้ครั้งเดียวทิ้ง เติมน้ำจากจุดบริการชุมชน',
            saving: 1.20,
            unit: 'kgCO2e/คน',
            type: 'saving',
            icon: '🥤'
        },
        {
            id: 'walking',
            title: '🚶 เดินเท้าสำรวจหมู่บ้านแทนการนั่งรถ',
            subtitle: 'เดินเลียบสัมผัสสายน้ำและวิถีชุมชนในระยะ 1-3 กม. ไร้มลพิษ 100%',
            saving: 3.00,
            unit: 'kgCO2e/คน',
            type: 'saving',
            icon: '🚶'
        },
        {
            id: 'plogging',
            title: '🧹 กิจกรรมเดินป่าช่วยเก็บขยะ (Plogging)',
            subtitle: 'ช่วยเก็บขยะตามเส้นทางธรรมชาติ น้ำตกสองปาน หรือลานหมู่บ้านนำมารีไซเคิล',
            saving: 2.00,
            unit: 'kgCO2e/คน',
            type: 'saving',
            icon: '🧹'
        },
        {
            id: 'energy_save',
            title: '💡 ประหยัดพลังงานในห้องพักโฮมสเตย์',
            subtitle: 'ปิดไฟ ปิดพัดลม และถอดปลั๊กอุปกรณ์ทุกครั้งก่อนออกจากห้องพัก',
            saving: 1.00,
            unit: 'kgCO2e/คน',
            type: 'saving',
            icon: '💡'
        },
        {
            id: 'banana_leaf',
            title: '🛍️ ปฏิเสธถุงพลาสติก / อุดหนุนของฝากห่อใบตอง',
            subtitle: 'เลือกซื้อสินค้าหัตถกรรมชุมชนและอาหารบรรจุภัณฑ์ธรรมชาติย่อยสลายได้',
            saving: 1.50,
            unit: 'kgCO2e/คน',
            type: 'saving',
            icon: '🛍️'
        }
    ]
};

// -------------------------------------------------------------
// 2. Application State & Storage
// -------------------------------------------------------------

const STORAGE_KEY = 'miangmap_activity_tracker';

let trackerState = {
    selectedTransport: 'van',
    selectedVillageActivities: ['homestay', 'tea_craft'],
    selectedOffsets: ['tumbler', 'walking'],
    travelerName: 'นักเดินทางรักษ์โลก'
};

function saveTrackerState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerState));
    } catch (e) {
        console.warn("Could not save to localStorage:", e);
    }
}

function loadTrackerState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.selectedTransport) trackerState.selectedTransport = parsed.selectedTransport;
            if (Array.isArray(parsed.selectedVillageActivities)) trackerState.selectedVillageActivities = parsed.selectedVillageActivities;
            if (Array.isArray(parsed.selectedOffsets)) trackerState.selectedOffsets = parsed.selectedOffsets;
            if (parsed.travelerName) trackerState.travelerName = parsed.travelerName;
        }
    } catch (e) {
        console.warn("Could not load from localStorage:", e);
    }
}

// -------------------------------------------------------------
// 3. Render Activity Grids
// -------------------------------------------------------------

function renderTransportCards() {
    const container = document.getElementById('transportGrid');
    if (!container) return;

    container.innerHTML = ACTIVITIES_CONFIG.transport.map(item => {
        const isSelected = trackerState.selectedTransport === item.id;
        return `
            <div class="activity-tile ${isSelected ? 'selected' : ''}" onclick="selectTransport('${item.id}')">
                <div class="tile-top-row">
                    <div class="tile-icon-wrap">${item.icon}</div>
                    <div class="tile-indicator radio-style">${isSelected ? '●' : ''}</div>
                </div>
                <div class="tile-body">
                    <div class="tile-title">${escapeHTML(item.title)}</div>
                    <div class="tile-subtitle">${escapeHTML(item.subtitle)}</div>
                </div>
                <div class="tile-footer">
                    <span class="carbon-badge-pill emission">+${item.emission.toFixed(2)} ${item.unit}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">${isSelected ? 'เลือกแล้ว' : 'คลิกเพื่อเลือก'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderVillageActivitiesCards() {
    const container = document.getElementById('villageActivitiesGrid');
    if (!container) return;

    container.innerHTML = ACTIVITIES_CONFIG.village.map(item => {
        const isSelected = trackerState.selectedVillageActivities.includes(item.id);
        const hasBreakdown = item.breakdown ? true : false;
        const breakdownBtn = hasBreakdown 
            ? `<button type="button" class="btn-tile-breakdown" onclick="event.stopPropagation(); openCarbonBreakdown('${item.id}')" title="คลิกดูที่มาและการคำนวณคาร์บอน">📊 ดูที่มาคาร์บอน</button>` 
            : '';
        const hostTag = item.host 
            ? `<div class="tile-host-tag">🏡 ${escapeHTML(item.host)}</div>`
            : '';

        return `
            <div class="activity-tile ${isSelected ? 'selected' : ''}" onclick="toggleVillageActivity('${item.id}')">
                <div class="tile-top-row">
                    <div class="tile-icon-wrap">${item.icon}</div>
                    <div class="tile-indicator">${isSelected ? '✓' : ''}</div>
                </div>
                <div class="tile-body">
                    <div class="tile-title">${escapeHTML(item.title)}</div>
                    ${hostTag}
                    <div class="tile-subtitle">${escapeHTML(item.subtitle)}</div>
                </div>
                <div class="tile-footer">
                    <span class="carbon-badge-pill emission">+${item.emission.toFixed(2)} ${item.unit}</span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${breakdownBtn}
                        <span style="font-size: 11px; color: ${isSelected ? 'var(--primary-light)' : 'var(--text-muted)'};">${isSelected ? 'ทำกิจกรรมนี้' : 'ยังไม่ได้ติ๊ก'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openCarbonBreakdown(id) {
    const item = ACTIVITIES_CONFIG.village.find(v => v.id === id);
    if (!item || !item.breakdown) return;

    const modal = document.getElementById('carbonBreakdownModal');
    if (!modal) return;

    document.getElementById('breakdownModalTitle').innerText = item.breakdown.title || '📊 ที่มาและการคำนวณคาร์บอน';
    document.getElementById('breakdownModalSource').innerText = `📑 ${item.breakdown.source || 'เอกสารผลประเมินคาร์บอนกิจกรรมชุมชนบ้านป่าเหมี้ยง'}`;

    let tableHtml = `
        <table class="breakdown-table">
            <thead>
                <tr>
                    <th style="width: 32%;">ขั้นตอน / รายการ</th>
                    <th style="width: 46%;">รายละเอียดและปัจจัยการปล่อยก๊าซ</th>
                    <th style="width: 22%; text-align: right;">การปล่อยคาร์บอน</th>
                </tr>
            </thead>
            <tbody>
    `;

    item.breakdown.steps.forEach(s => {
        tableHtml += `
            <tr>
                <td class="step-name">${escapeHTML(s.step)}</td>
                <td class="step-desc">${escapeHTML(s.detail)}</td>
                <td class="step-val">${escapeHTML(s.emission)}</td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="font-weight: 700; color: #ffffff;">สรุปการปล่อยคาร์บอนสุทธิ</td>
                    <td class="step-total">${escapeHTML(item.breakdown.total)}</td>
                </tr>
            </tfoot>
        </table>
    `;

    if (item.mapId) {
        tableHtml += `
            <div class="breakdown-host-connect">
                <div style="font-size: 13.5px; color: var(--text-overcast);">📍 สถานที่จัดกิจกรรม: <strong style="color: #ffffff;">${escapeHTML(item.host || item.title)}</strong></div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <a href="../map/index.html?focus=${item.mapId}" class="btn-link-mini" target="_blank">🗺️ ดูหมุดบนแผนที่</a>
                    <a href="../attraction/index.html?id=${item.mapId}" class="btn-link-mini" target="_blank">🔍 อ่านเรื่องราวฉบับเต็ม</a>
                </div>
            </div>
        `;
    }

    document.getElementById('breakdownModalContent').innerHTML = tableHtml;
    modal.style.display = 'flex';
}


function renderGreenActionsCards() {
    const container = document.getElementById('greenActionsGrid');
    if (!container) return;

    container.innerHTML = ACTIVITIES_CONFIG.offsets.map(item => {
        const isSelected = trackerState.selectedOffsets.includes(item.id);
        return `
            <div class="activity-tile ${isSelected ? 'selected selected-green' : ''}" onclick="toggleOffset('${item.id}')">
                <div class="tile-top-row">
                    <div class="tile-icon-wrap">${item.icon}</div>
                    <div class="tile-indicator">${isSelected ? '✓' : ''}</div>
                </div>
                <div class="tile-body">
                    <div class="tile-title">${escapeHTML(item.title)}</div>
                    <div class="tile-subtitle">${escapeHTML(item.subtitle)}</div>
                </div>
                <div class="tile-footer">
                    <span class="carbon-badge-pill saving">-${item.saving.toFixed(2)} ${item.unit}</span>
                    <span style="font-size: 11px; color: ${isSelected ? '#34d399' : 'var(--text-muted)'};">${isSelected ? 'ร่วมเซฟคาร์บอน' : 'ยังไม่ได้ติ๊ก'}</span>
                </div>
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------------
// 4. User Interaction Handlers
// -------------------------------------------------------------

function selectTransport(id) {
    trackerState.selectedTransport = id;
    saveTrackerState();
    renderTransportCards();
    updateLiveCarbonCalculations();
}

function toggleVillageActivity(id) {
    const idx = trackerState.selectedVillageActivities.indexOf(id);
    if (idx > -1) {
        trackerState.selectedVillageActivities.splice(idx, 1);
    } else {
        trackerState.selectedVillageActivities.push(id);
    }
    saveTrackerState();
    renderVillageActivitiesCards();
    updateLiveCarbonCalculations();
}

function toggleOffset(id) {
    const idx = trackerState.selectedOffsets.indexOf(id);
    if (idx > -1) {
        trackerState.selectedOffsets.splice(idx, 1);
    } else {
        trackerState.selectedOffsets.push(id);
    }
    saveTrackerState();
    renderGreenActionsCards();
    updateLiveCarbonCalculations();
}

function resetActivityTracker() {
    trackerState = {
        selectedTransport: 'van',
        selectedVillageActivities: [],
        selectedOffsets: [],
        travelerName: 'นักเดินทางรักษ์โลก'
    };
    saveTrackerState();
    renderTransportCards();
    renderVillageActivitiesCards();
    renderGreenActionsCards();
    updateLiveCarbonCalculations();

    const nameInput = document.getElementById('travelerNameInput');
    if (nameInput) nameInput.value = '';

    showToast("รีเซ็ตการเลือกกิจกรรมทั้งหมดเรียบร้อยแล้ว", "success");
}

// -------------------------------------------------------------
// 5. Live Carbon Calculations & Metrics
// -------------------------------------------------------------

function calculateCurrentCarbon() {
    // 1. Inbound Transport
    const transportObj = ACTIVITIES_CONFIG.transport.find(t => t.id === trackerState.selectedTransport) || ACTIVITIES_CONFIG.transport[2];
    const transportEmission = transportObj.emission;

    // 2. Village Activities
    let villageEmission = 0;
    const selectedVillageItems = [];
    trackerState.selectedVillageActivities.forEach(id => {
        const item = ACTIVITIES_CONFIG.village.find(v => v.id === id);
        if (item) {
            villageEmission += item.emission;
            selectedVillageItems.push(item);
        }
    });

    // 3. Green Offsets
    let totalSavings = 0;
    const selectedOffsetItems = [];
    trackerState.selectedOffsets.forEach(id => {
        const item = ACTIVITIES_CONFIG.offsets.find(o => o.id === id);
        if (item) {
            totalSavings += item.saving;
            selectedOffsetItems.push(item);
        }
    });

    const grossEmissions = transportEmission + villageEmission;
    const netCarbon = Math.max(0, grossEmissions - totalSavings);

    // Three Positive Prestige Tiers aligned with community standards & TGO references
    let tier = {
        title: '🥇 เหรียญทอง (Gold Tier)',
        badgeClass: 'badge-gold',
        level: 'gold',
        icon: '🥇',
        honorTitle: 'ผู้พิทักษ์ผืนป่าเหมี้ยง',
        honorEnglishTitle: 'Forest Guardian',
        honorDesc: 'ยอดคาร์บอนต่ำเป็นเลิศ เป็นมิตรต่อผืนป่าต้นน้ำและร่วมทำกิจกรรมลดขยะอย่างน่าชื่นชม'
    };

    if (netCarbon > 30) {
        tier = {
            title: '🥉 เหรียญทองแดง (Bronze Tier)',
            badgeClass: 'badge-bronze',
            level: 'bronze',
            icon: '🥉',
            honorTitle: 'ทูตการท่องเที่ยวสีเขียว',
            honorEnglishTitle: 'Green Ambassador',
            honorDesc: 'ร่วมตระหนักรู้และประเมินรอยเท้าคาร์บอน พร้อมร่วมเป็นส่วนหนึ่งในการดูแลรักษาธรรมชาติ'
        };
    } else if (netCarbon >= 15) {
        tier = {
            title: '🥈 เหรียญเงิน (Silver Tier)',
            badgeClass: 'badge-silver',
            level: 'silver',
            icon: '🥈',
            honorTitle: 'นักเดินทางรักษ์ธรรมชาติ',
            honorEnglishTitle: 'Eco Pathfinder',
            honorDesc: 'คาร์บอนฟุตพริ้นท์อยู่ในเกณฑ์มาตรฐานชุมชนที่ดี ร่วมขับเคลื่อนการท่องเที่ยวสีเขียว'
        };
    }

    return {
        transportObj,
        selectedVillageItems,
        selectedOffsetItems,
        grossEmissions,
        totalSavings,
        netCarbon,
        tier
    };
}

function updateLiveCarbonCalculations() {
    const data = calculateCurrentCarbon();

    // Update sticky summary bar
    const barGross = document.getElementById('barGrossEmissions');
    const barSavings = document.getElementById('barTotalSavings');
    const barNet = document.getElementById('barNetCarbon');
    const barBadge = document.getElementById('barTierBadge');

    if (barGross) barGross.innerHTML = `${data.grossEmissions.toFixed(2)} <small>kgCO2e</small>`;
    if (barSavings) barSavings.innerHTML = `${data.totalSavings.toFixed(2)} <small>kgCO2e</small>`;
    if (barNet) barNet.innerHTML = `${data.netCarbon.toFixed(2)} <small>kgCO2e</small>`;

    if (barBadge) {
        barBadge.innerHTML = `<span class="tier-pill ${data.tier.badgeClass}">${data.tier.icon} ${data.tier.honorTitle}</span>`;
    }
}

// -------------------------------------------------------------
// 6. Eco Certificate Modal Logic & Export Functions
// -------------------------------------------------------------

function formatThaiFullDate(dateStr) {
    if (!dateStr) dateStr = new Date().toISOString().split('T')[0];
    const parts = dateStr.split('-');
    const y = parseInt(parts[0], 10) + 543;
    const mIndex = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return `${d} เดือน${months[mIndex]} พุทธศักราช ${y}`;
}

function generateCertificateSerial(travelerName, dateStr) {
    const seed = (travelerName || 'นักเดินทางรักษ์โลก') + dateStr + 'MIANGMAP';
    const hash = Math.abs(seed.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0)).toString(16).toUpperCase().padStart(6, '0');
    return `001.${hash.slice(0, 3)}/${hash.slice(3, 6) || '001'}`;
}

function openEcoCardModal() {
    const modal = document.getElementById('ecoCardModal');
    if (!modal) return;

    const data = calculateCurrentCarbon();

    // Name input and display
    const nameInput = document.getElementById('travelerNameInput');
    if (nameInput) {
        nameInput.value = trackerState.travelerName === 'นักเดินทางรักษ์โลก' ? '' : trackerState.travelerName;
    }

    const userNameDisplay = document.getElementById('ticketUserNameDisplay');
    if (userNameDisplay) userNameDisplay.innerText = trackerState.travelerName || 'นักเดินทางรักษ์โลก';

    // Rank Medal Icon, Tier Title & Honor Name
    const honorIcon = document.getElementById('ticketHonorIcon');
    if (honorIcon) honorIcon.innerText = data.tier.icon;

    const honorTitle = document.getElementById('ticketHonorTitle');
    if (honorTitle) honorTitle.innerText = data.tier.title.split('(')[0].trim();

    const honorName = document.getElementById('cardRankHonorName');
    if (honorName) honorName.innerText = data.tier.honorTitle;

    // Numbers & Carbon Credit Savings
    const savingsDisplay = document.getElementById('ticketSavingsDisplay');
    if (savingsDisplay) savingsDisplay.innerText = `-${data.totalSavings.toFixed(2)}`;

    const netDisplay = document.getElementById('ticketNetDisplay');
    if (netDisplay) netDisplay.innerText = data.netCarbon.toFixed(2);

    modal.style.display = 'flex';
}

function updateCardTravelerName(val) {
    const cleanVal = val.trim();
    trackerState.travelerName = cleanVal || 'นักเดินทางรักษ์โลก';
    saveTrackerState();

    const display = document.getElementById('ticketUserNameDisplay');
    if (display) display.innerText = trackerState.travelerName;
}

function buildCertificateUrl() {
    const data = calculateCurrentCarbon();
    const today = new Date().toISOString().split('T')[0];

    const params = new URLSearchParams({
        name: trackerState.travelerName,
        date: today,
        gross: data.grossEmissions.toFixed(2),
        saved: data.totalSavings.toFixed(2),
        net: data.netCarbon.toFixed(2),
        tier: data.tier.level,
        title: data.tier.honorTitle,
        engTitle: data.tier.honorEnglishTitle
    });

    const baseUrl = window.location.origin + window.location.pathname.replace(/\/travel_package\/?(index\.html)?$/, '/certificate/index.html');
    return `${baseUrl}?${params.toString()}`;
}

function copyCertificateShareLink() {
    const shareUrl = buildCertificateUrl();

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl)
            .then(() => showToast("🔗 คัดลอกลิงก์แชร์การ์ดสรุปผลเรียบร้อยแล้ว!", "success"))
            .catch(() => fallbackCopyText(shareUrl));
    } else {
        fallbackCopyText(shareUrl);
    }
}

function openCertificateFullPage() {
    const shareUrl = buildCertificateUrl();
    window.open(shareUrl, '_blank');
}

function downloadCertificateImage() {
    const cardElement = document.getElementById('minimalEcoCard') || document.getElementById('ecoCertificateCard');
    if (!cardElement) {
        showToast("ไม่พบองค์ประกอบการ์ดสรุปผล", "error");
        return;
    }

    showToast("⏳ กำลังประมวลผลและสร้างรูปภาพการ์ดสรุปผล 1:1...", "info");

    if (typeof html2canvas !== 'function') {
        showToast("กำลังดาวน์โหลดไลบรารีสร้างภาพ กรุณาลองใหม่อีกครั้ง", "error");
        return;
    }

    html2canvas(cardElement, {
        scale: 3, // 1:1 Crisp High-res export (approx. 1320 x 1320 px)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        const cleanName = (trackerState.travelerName || 'Eco-Traveler').replace(/\s+/g, '_');
        link.download = `Pa-Miang-EcoCard-${cleanName}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("🎉 ดาวน์โหลดรูปภาพการ์ดสรุปผล 1:1 สำเร็จ!", "success");
    }).catch(err => {
        console.error("html2canvas error:", err);
        showToast("ไม่สามารถสร้างรูปภาพได้ กรุณาลองใหม่อีกครั้ง", "error");
    });
}

function copyCardSummaryText() {
    const data = calculateCurrentCarbon();
    const today = new Date().toISOString().split('T')[0];

    const summaryText = `🌿 สถิติการท่องเที่ยวคาร์บอนต่ำ ณ ชุมชนบ้านป่าเหมี้ยง • MIANG MAP
👤 นักเดินทาง: ${trackerState.travelerName}
🏆 ผลประเมิน: ${data.tier.icon} ${data.tier.title.split('(')[0].trim()} (${data.tier.honorTitle})
🌱 ยอดคาร์บอนเครดิตที่ช่วยลดได้: -${data.totalSavings.toFixed(2)} kgCO2e
📊 คาร์บอนสุทธิของทริป: ${data.netCarbon.toFixed(2)} kgCO2e
📅 วันที่: ${today}

“ขอบคุณที่ร่วมท่องเที่ยวอย่างรับผิดชอบ และช่วยดูแลผืนป่าต้นน้ำบ้านป่าเหมี้ยงไปด้วยกัน”
— ชุมชนท่องเที่ยวบ้านป่าเหมี้ยง จ.ลำปาง
#MIANGMAP #บ้านป่าเหมี้ยง #LowCarbonTourism #Lampang`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summaryText)
            .then(() => showToast("📋 คัดลอกข้อความสรุปผลลง Clipboard เรียบร้อยแล้ว!", "success"))
            .catch(() => fallbackCopyText(summaryText));
    } else {
        fallbackCopyText(summaryText);
    }
}

function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast("คัดลอกข้อความสำเร็จ!", "success");
    } catch (err) {
        showToast("ไม่สามารถคัดลอกได้ กรุณาลองใหม่", "error");
    }
    document.body.removeChild(textarea);
}

function printOrSaveEcoPass() {
    window.print();
}

// -------------------------------------------------------------
// 7. General Navigation, Modals & Toast Utilities
// -------------------------------------------------------------

function toggleHamburger() {
    document.getElementById('hamburgerBtn').classList.toggle('open');
    document.getElementById('hamburgerMenu').classList.toggle('open');
    document.getElementById('hamburgerBackdrop').classList.toggle('open');
}

function goHome() {
    window.location.href = '../home/index.html';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const content = document.createElement('span');
    content.innerText = message;
    toast.appendChild(content);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    };
    toast.appendChild(closeBtn);

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal('ecoCardModal');
        closeModal('carbonBreakdownModal');
    }
});

// -------------------------------------------------------------
// 8. Initialization
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    loadTrackerState();
    renderTransportCards();
    renderVillageActivitiesCards();
    renderGreenActionsCards();
    updateLiveCarbonCalculations();
});

// Run immediately as well in case script loads after DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadTrackerState();
    renderTransportCards();
    renderVillageActivitiesCards();
    renderGreenActionsCards();
    updateLiveCarbonCalculations();
}

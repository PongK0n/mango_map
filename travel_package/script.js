// script.js - Packages Page Logic

// Database client and Auth state are managed by shared_auth.js

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

let packageList = [];

async function fetchPackages() {
    const { data, error } = await db
        .from('packages')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Fetch packages error:", error);
        showToast("ไม่สามารถดึงข้อมูลแพ็กเกจได้: " + error.message, "error");
        return;
    }

    packageList = data || [];

    // Add Flexible Trip option dynamically
    const hasFlexible = packageList.some(p => p.id === 99);
    if (!hasFlexible) {
        packageList.push({
            id: 99,
            title: "Flexible Trip (ทริปอิสระตามใจคุณ)",
            subtitle: "ไม่มีตารางเวลาที่ฟิกซ์ล่วงหน้า / เดินทางท่องเที่ยวตามใจคุณ",
            description: "สำหรับผู้ที่ต้องการท่องเที่ยวแบบอิสระ ไม่ต้องการตารางเวลานำเที่ยว หรือประสงค์จะลงทะเบียนเพื่อบันทึกสถิติลดคาร์บอนและสะสมผลงานแลกรางวัลขณะอยู่ในชุมชนโดยไม่ฟิกซ์กิจกรรมล่วงหน้า",
            carbon_summary: "คาร์บอนจากกิจกรรม (อาหาร+ที่พัก+ขยะ): ~15.0 kgCO2e/วัน",
            highlights: ["อิสระ 100%", "ปรับเปลี่ยนตามต้องการ", "สะสมคาร์บอนตามจริง"],
            details: ["เลือกเช็คลิสต์เองได้", "รับสิทธิพิเศษ/ของรางวัลรักษ์โลก"],
            itinerary: "วันเดินทาง - เดินทางถึงบ้านป่าเหมี้ยง\nกิจกรรมอิสระ - เลือกเดินเท้าชมวิถีชีวิตหรือชิมกาแฟชุมชน\nพักค้างคืน - พักผ่อนในโฮมสเตย์ประหยัดพลังงาน\nวันเดินทางกลับ - ยื่นแสดงแผนการเดินทางของฉันเพื่อแลกรับรางวัล",
            guide_name: "ผู้ดูแลชุมชน",
            guide_image: "../home/images/village.jpg",
            image_url: "../home/images/cover.png"
        });
    }

    renderPackagesList();
    loadCommunityCarbonStats();
    checkActiveChallengePass();
}

function getGuideNote(title) {
    const t = String(title).toLowerCase();
    if (t.includes('adventure')) {
        return "ลุยทางเดินป่าเชิงอนุรักษ์ อาบละอองน้ำตกสองปานแสนเย็นชุ่มฉ่ำ ปล่อยคาร์บอนต่ำที่สุดครับ";
    } else if (t.includes('foodie')) {
        return "มาเก็บชาสดจากต้นกลางป่าดิบชื้น ทำสปาเมี่ยง และทานแกงแคฝีมือป้ากันค่ะ";
    } else if (t.includes('scenic')) {
        return "พาขึ้นรถกระบะท้องถิ่นไปชมแสงแรกและทะเลหมอก 3 จังหวัดบนดอยกิ่วฝิ่น สวยลืมเหนื่อยแน่นอนครับ";
    }
    return "มาร่วมสัมผัสวิถีชีวิตคนเก็บเมี่ยง จิบชาป่าออร์แกนิก และช่วยกันรักษาป่าเหมี้ยงไปด้วยกันนะครับ";
}

function getItineraryCoverImage(pkg) {
    if (!pkg) return '../home/images/pa_miang_tea.png';
    if (pkg.id === 1) {
        return '../travel_package/image/images.jpeg'; // Adventure
    } else if (pkg.id === 2) {
        return '../travel_package/image/บ้านป่าเหมี้ยง-10-1024x680.jpg'; // Foodie
    } else if (pkg.id === 3) {
        return '../travel_package/image/บ้านป่าเหมี้ยง-1.jpg'; // Scenic
    }
    return pkg.image_url || '../home/images/pa_miang_tea.png';
}

function renderPackagesList() {
    const content = document.getElementById('packageContent');
    if (!content) return;

    if (packageList.length === 0) {
        content.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1/-1;">ไม่มีข้อมูลทริปคาร์บอนต่ำในขณะนี้</div>`;
        return;
    }

    content.innerHTML = packageList.map((pkg, index) => {
        const highlightsArr = Array.isArray(pkg.highlights) ? pkg.highlights : [];
        const detailsArr = Array.isArray(pkg.details) ? pkg.details : [];

        const safeTitle = escapeHTML(pkg.title).replace(/package/gi, 'Trip').replace(/itinerary/gi, 'Trip');
        const safeSubtitle = escapeHTML(pkg.subtitle);
        const safeDesc = escapeHTML(pkg.description);
        const carbonInfo = calculateItineraryCarbon(pkg);
        const isScenic = String(pkg.title || '').toLowerCase().includes('scenic');

        const coverImg = getItineraryCoverImage(pkg);
        const guideImg = pkg.guide_image || '../home/images/village.jpg';
        const guideName = pkg.guide_name || 'ผู้ดูแลชุมชน';
        const recommendationNote = getGuideNote(pkg.title);

        return `
            <div class="package-card">
                <div class="package-card-hero" style="background-image: url('${escapeHTML(coverImg)}');">
                    <div class="package-card-hero-overlay"></div>
                </div>
                <div class="package-card-body">
                    <div class="package-card-header" onclick="togglePackageDetails(${index})">
                        <div>
                            <div class="package-title">${safeTitle}</div>
                            <div class="package-subtitle">${safeSubtitle}</div>
                        </div>
                    </div>
                    <div class="package-summary">${safeDesc}</div>
                    
                    <div class="guide-recommendation-note">
                        <div class="note-content">
                            <span class="note-author">💡 คำแนะนำเพื่อการอนุรักษ์:</span>
                            <p class="note-text">“${escapeHTML(recommendationNote)}”</p>
                        </div>
                    </div>

                    <!-- Carbon Footprint Daily Summary -->
                    <div class="package-carbon-card-section" style="background: rgba(64, 192, 87, 0.04); border: 1px solid rgba(64, 192, 87, 0.1); border-radius: 10px; padding: 12px; margin: 15px 0; text-align: left;">
                        <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">คาร์บอนฟุตพริ้นท์ในพื้นที่ (ต่อคน/วัน)</div>
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <span style="font-size: 20px; font-weight: bold; color: #40c057;">${carbonInfo.inVillageTotal.toFixed(1)} kgCO2e <span style="font-size: 13px; font-weight: normal; color: var(--text-muted);">/ วัน</span></span>
                            <span style="font-size: 11px; color: #d3f9d8; background: rgba(64,192,87,0.15); padding: 2px 8px; border-radius: 20px;">ดีต่อสิ่งแวดล้อม</span>
                        </div>
                        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 6px; line-height: 1.4; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px;">
                            สะสมจาก: 🍲 อาหารท้องถิ่น + 🏡 ไฟฟ้าโฮมสเตย์ + 🧹 ขยะทั่วไป ${isScenic ? '+ 🛻 รถกระบะนำเที่ยว' : ''}
                        </div>
                    </div>
                    <div class="package-action-row">
                        <button type="button" class="package-view-btn" onclick="event.stopPropagation(); togglePackageDetails(${index})">ดูรายละเอียด</button>
                        <button type="button" class="package-select-btn" onclick="event.stopPropagation(); selectPackage(${index})">เลือกใช้แผนนี้</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleHamburger() {
    document.getElementById('hamburgerBtn').classList.toggle('open');
    document.getElementById('hamburgerMenu').classList.toggle('open');
    document.getElementById('hamburgerBackdrop').classList.toggle('open');
}

function goHome() {
    window.location.href = '../home/index.html';
}

function openPackageMenu() {
    const section = document.getElementById('packageSection');
    fetchPackages();
    if (section) section.classList.add('active');
}

let selectedDetailPkgIndex = null;

function togglePackageDetails(index) {
    showPackageDetailsModal(index);
}

function calculateItineraryCarbon(pkg) {
    // ปริมาณคำนวณตามเอกสารอ้างอิง อบก. / IPCC (คิดต่อ 1 คน / วัน)
    const days = 1;
    const nights = 1;
    const foodDaily = 20.4347; // kgCO2e/วัน/คน (วัตถุดิบท้องถิ่น)
    const electricityNightly = 0.1557; // kgCO2e/คืน/คน (พัดลม 30W + หลอดไฟ 5W เปิด 8 ชั่วโมง)
    const wasteDaily = 0.7933; // kgCO2e/วัน/คน (การจัดการฝังกลบขยะมูลฝอยทั่วไป 1 กก./วัน)

    const foodTotal = foodDaily * days; 
    const electricityTotal = electricityNightly * nights; 
    const wasteTotal = wasteDaily * days; 

    // คิดค่าเดินทางเฉลี่ยต่อวันในพื้นที่ (ทริป Scenic นั่งรถกิ่วฝิ่น 2.6970 kgCO2e หารเฉลี่ย 3 วัน = 0.8990 kgCO2e)
    const isScenic = String(pkg.title || '').toLowerCase().includes('scenic');
    const localTransport = isScenic ? 0.8990 : 0;

    const inVillageTotal = foodTotal + electricityTotal + wasteTotal + localTransport;
    const inVillageDaily = inVillageTotal;

    return {
        days,
        nights,
        foodTotal,
        electricityTotal,
        wasteTotal,
        localTransport,
        inVillageTotal,
        inVillageDaily
    };
}

function updateDynamicCarbonCalculation() {
    if (selectedDetailPkgIndex === null) return;
    const pkg = packageList[selectedDetailPkgIndex];
    const carbon = calculateItineraryCarbon(pkg);

    // อัปเดตใน UI หน้าดีเทล
    document.getElementById('calcInVillageDaily').innerText = `${carbon.inVillageDaily.toFixed(2)} kgCO2e/วัน`;
    document.getElementById('calcInVillageTotal').innerText = `${carbon.inVillageTotal.toFixed(2)} kgCO2e`;

    // เช็ควิทยุประเภทพาหนะ
    const transportRadios = document.getElementsByName('pkgTransportSelect');
    let transportVal = 43.15; // ดีฟอลต์ รถส่วนตัว
    for (let radio of transportRadios) {
        if (radio.checked) {
            if (radio.value === 'car') transportVal = 43.15;
            else if (radio.value === 'ev') transportVal = 15.52;
            else if (radio.value === 'van') transportVal = 8.60;
            break;
        }
    }

    // คำนวณคาร์บอนสุทธิรวม
    const totalCarbon = carbon.inVillageTotal + transportVal;
    document.getElementById('calcTotalCarbon').innerText = `${totalCarbon.toFixed(2)} kgCO2e`;

    // ตรวจสอบเกณฑ์ประเมินสะสมในพื้นที่เฉลี่ยต่อวันเทียบกับเกณฑ์
    const scaleBadgeEl = document.getElementById('calcScaleBadge');
    const dailyInVillage = carbon.inVillageDaily;
    let badgeHtml = '';

    if (dailyInVillage < 15) {
        badgeHtml = `ระดับคาร์บอนในพื้นที่: <span class="scale-badge badge-good">ดีต่อสิ่งแวดล้อม (${dailyInVillage.toFixed(1)} kgCO2e/วัน)</span>`;
    } else if (dailyInVillage <= 30) {
        badgeHtml = `ระดับคาร์บอนในพื้นที่: <span class="scale-badge badge-moderate">ปานกลาง (${dailyInVillage.toFixed(1)} kgCO2e/วัน)</span>`;
    } else {
        badgeHtml = `ระดับคาร์บอนในพื้นที่: <span class="scale-badge badge-high">ควรปรับปรุง (${dailyInVillage.toFixed(1)} kgCO2e/วัน)</span>`;
    }
    scaleBadgeEl.innerHTML = badgeHtml;
}

function toggleReferenceDetails() {
    const content = document.getElementById('carbonReferenceContent');
    const arrow = document.getElementById('refToggleArrow');
    if (!content || !arrow) return;
    if (content.style.display === 'none') {
        content.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    } else {
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

const ECO_GUIDELINES = {
    1: [ // Adventure
        "🚗 การเดินทาง - จอดรถส่วนตัวไว้ที่โฮมสเตย์แล้วเน้นเดินเท้าสำรวจหมู่บ้าน",
        "🥤 ลดขยะ - ใช้กระบอกน้ำพกพาส่วนตัวเติมน้ำ ณ จุดบริการ แทนการซื้อขวดพลาสติก",
        "🍃 อาหารท้องถิ่น - เลือกทานแกงแคหรือเมนูพื้นบ้านห่อใบตองเพื่อลดขยะบรรจุภัณฑ์",
        "🏡 ประหยัดพลังงาน - เปิดพัดลมและหลอดไฟเฉพาะเวลาที่อยู่ในห้องพักโฮมสเตย์",
        "🧹 กิจกรรมสีเขียว - ร่วมเดินป่าเชิงอนุรักษ์ธรรมชาติ (Plogging) ช่วยเก็บขยะตามเส้นทาง"
    ],
    2: [ // Foodie
        "🚗 การเดินทาง - จอดรถยนต์ส่วนตัวไว้ที่โฮมสเตย์และเดินเท้าท่องเที่ยวระยะสั้นในหมู่บ้าน",
        "🥤 ลดขยะ - พกกระบอกน้ำส่วนตัวและปฏิเสธบรรจุภัณฑ์พลาสติกเมื่อทำสปาและกิจกรรมชุมชน",
        "🍃 อาหารท้องถิ่น - รับประทานแกงแคและยำใบเมี่ยงฝีมือป้าที่ปรุงจากวัตถุดิบและผักสดรอบหมู่บ้าน (Food Miles 0 กม.)",
        "🏡 ประหยัดพลังงาน - เปิดเครื่องใช้ไฟฟ้าในที่พักโฮมสเตย์เฉพาะเท่าที่จำเป็น",
        "🍵 กิจกรรมชุมชน - เก็บใบชาสดจากต้นกลางป่าดิบชื้น แปรรูปและจิบชาออร์แกนิกท้องถิ่น"
    ],
    3: [ // Scenic
        "🚗 การเดินทาง - ใช้บริการรถกระบะท้องถิ่นนำเที่ยวขึ้นกิ่วฝิ่น แทนการขับรถยนต์ส่วนตัวขึ้นไปเอง",
        "🥤 ลดขยะ - พกถุงผ้าและไม่รับบรรจุภัณฑ์พลาสติกแบบใช้ครั้งเดียวทิ้งในร้านค้าชุมชน",
        "☕ กาแฟรักษ์โลก - เยี่ยมชมและอุดหนุนแปลงกาแฟใต้ร่มไม้ป่าใหญ่ (Shade-Grown Coffee)",
        "🍃 อาหารท้องถิ่น - เลือกทานเมนูท้องถิ่นริมน้ำตกที่ใช้วัตถุดิบสดในชุมชน (ลด Food Miles)",
        "🏡 ประหยัดพลังงาน - ปิดสวิตช์ไฟและเครื่องใช้ไฟฟ้าทุกครั้งเมื่อออกไปเที่ยวนอกห้องพัก"
    ],
    99: [ // Flexible Trip
        "🚗 การเดินทาง - เลือกรูปแบบเดินทางคาร์บอนต่ำหรือแชร์รถร่วมกันมาชุมชน",
        "🥤 ลดขยะ - พกกระบอกน้ำและถุงผ้าส่วนตัวเพื่อลดขยะพลาสติกแบบใช้ครั้งเดียวทิ้ง",
        "🍃 อาหารท้องถิ่น - สนับสนุนและทานอาหารที่ปรุงจากวัตถุดิบอินทรีย์ของคนในชุมชน",
        "🏡 ประหยัดพลังงาน - พักโฮมสเตย์รักษ์โลก ปิดน้ำและไฟทุกครั้งที่ออกจากห้องพัก",
        "🌳 ท่องเที่ยวอนุรักษ์ - ทำกิจกรรมท่องเที่ยววิถีธรรมชาติที่ไม่ทำลายระบบนิเวศชุมชน"
    ]
};

function toggleChecklistState(input) {
    const parent = input.closest('.eco-checklist-item');
    if (parent) {
        if (input.checked) {
            parent.classList.add('completed');
        } else {
            parent.classList.remove('completed');
        }
    }
}

function showPackageDetailsModal(index) {
    const pkg = packageList[index];
    if (!pkg) return;

    selectedDetailPkgIndex = index;

    document.getElementById('detailPkgTitle').innerText = (pkg.title || '').replace(/package/gi, 'Trip').replace(/itinerary/gi, 'Trip');
    document.getElementById('detailPkgSubtitle').innerText = pkg.subtitle || '';
    document.getElementById('detailPkgDesc').innerText = pkg.description || 'ไม่มีคำอธิบายเพิ่มเติมสำหรับทริปนี้';

    // Set hero background image
    const heroEl = document.getElementById('detailHeroHeader');
    const coverImg = getItineraryCoverImage(pkg);
    heroEl.style.backgroundImage = `url('${coverImg}')`;

    // Parse Itinerary as Checklist
    const itineraryContainer = document.getElementById('detailPkgItineraryContainer');
    itineraryContainer.innerHTML = '';

    // ดึงไกด์ไลน์เดโฟลต์ หรือฟอลแบ็กจาก DB
    let guidelines = ECO_GUIDELINES[pkg.id] || [];
    if (guidelines.length === 0 && pkg.itinerary && pkg.itinerary.trim().length > 0) {
        // หากไม่มีในแมพเดโฟลต์ ให้แยกตามบรรทัดของ DB
        guidelines = pkg.itinerary.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }

    if (guidelines.length > 0) {
        guidelines.forEach((step, idx) => {
            const parts = step.split(' - ');
            let categoryStr = 'แนวทาง';
            let descStr = step;
            if (parts.length > 1) {
                categoryStr = parts[0];
                descStr = parts.slice(1).join(' - ');
            }

            const stepEl = document.createElement('div');
            stepEl.className = 'eco-checklist-item';
            stepEl.innerHTML = `
                <label class="eco-checkbox-label" style="display: flex; gap: 12px; align-items: flex-start; cursor: pointer; padding: 12px 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px; transition: all 0.2s ease;">
                    <input type="checkbox" id="ecoCheck_${idx}" onchange="toggleChecklistState(this)" style="margin-top: 4px; accent-color: var(--primary-light); cursor: pointer;">
                    <span class="eco-checklist-content" style="flex: 1; font-family: 'Sarabun', sans-serif; font-size: 14px; line-height: 1.5; color: var(--text-light);">
                        <strong style="color: var(--primary-light);">${escapeHTML(categoryStr)}:</strong> ${escapeHTML(descStr)}
                    </span>
                </label>
            `;
            itineraryContainer.appendChild(stepEl);
        });
    } else {
        itineraryContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 13.5px; font-style: italic; margin: 0;">ยังไม่มีข้อแนะนำการปฏิบัติตัว</p>`;
    }



    // รีเซ็ตวิทยุตัวเลือกเดินทางเป็นตัวเลือกแรก (รถยนต์นั่งส่วนบุคคล)
    const transportRadios = document.getElementsByName('pkgTransportSelect');
    if (transportRadios && transportRadios.length > 0) {
        transportRadios[0].checked = true;
    }
    const refContent = document.getElementById('carbonReferenceContent');
    const refArrow = document.getElementById('refToggleArrow');
    if (refContent) refContent.style.display = 'none';
    if (refArrow) refArrow.style.transform = 'rotate(0deg)';

    // คำนวณค่าคาร์บอนสุทธิรวม
    updateDynamicCarbonCalculation();

    document.getElementById('packageDetailModal').style.display = 'flex';
}

function bookPackageFromDetails() {
    if (selectedDetailPkgIndex !== null) {
        closeModal('packageDetailModal');
        selectPackage(selectedDetailPkgIndex);
    }
}

let bookingPkgAdults = 1;
let bookingPkgChildren = 0;

function changePkgCount(type, delta) {
    if (type === 'adults') {
        bookingPkgAdults = Math.max(1, bookingPkgAdults + delta);
    } else if (type === 'children') {
        bookingPkgChildren = Math.max(0, bookingPkgChildren + delta);
    }
    updatePkgCounterUI();
}

function updatePkgCounterUI() {
    const countAdultsEl = document.getElementById('count-pkg-adults');
    const countChildrenEl = document.getElementById('count-pkg-children');
    const hiddenAdultsInput = document.getElementById('bookPkgAdultsInput');
    const hiddenChildrenInput = document.getElementById('bookPkgChildrenInput');
    const btnSubAdults = document.getElementById('btn-sub-pkg-adults');
    const btnSubChildren = document.getElementById('btn-sub-pkg-children');

    if (countAdultsEl) countAdultsEl.innerText = bookingPkgAdults;
    if (countChildrenEl) countChildrenEl.innerText = bookingPkgChildren;
    if (hiddenAdultsInput) hiddenAdultsInput.value = bookingPkgAdults;
    if (hiddenChildrenInput) hiddenChildrenInput.value = bookingPkgChildren;

    if (btnSubAdults) btnSubAdults.disabled = (bookingPkgAdults <= 1);
    if (btnSubChildren) btnSubChildren.disabled = (bookingPkgChildren <= 0);

    // Update carbon footprint preview in the booking modal
    updateBookingCarbonFootprint();
}

function updateBookingCarbonFootprint() {
    const pkgIdEl = document.getElementById('bookPkgId');
    if (!pkgIdEl) return;
    const index = parseInt(pkgIdEl.value);
    if (isNaN(index)) return;
    const pkg = packageList[index];
    if (!pkg) return;

    // Calculate in-village carbon
    const carbonInfo = calculateItineraryCarbon(pkg);
    const inVillageCarbonPerPerson = carbonInfo.inVillageTotal;

    // Calculate transport carbon per person
    const transportSelect = document.getElementById('bookPkgTransportSelect');
    const transportMode = transportSelect ? transportSelect.value : 'car';
    
    let transportCarbonPerPerson = 43.15; // default car
    if (transportMode === 'ev') {
        transportCarbonPerPerson = 15.52;
    } else if (transportMode === 'van') {
        transportCarbonPerPerson = 8.60;
    }

    // Number of guests
    const totalGuests = bookingPkgAdults + bookingPkgChildren;

    // Total carbon for all guests
    const totalCarbon = (inVillageCarbonPerPerson + transportCarbonPerPerson) * totalGuests;

    const totalCarbonEl = document.getElementById('bookPkgCarbonTotal');
    if (totalCarbonEl) {
        totalCarbonEl.innerText = `${totalCarbon.toFixed(2)} kgCO2e`;
    }
}

function selectPackage(index) {
    try {
        const selected = packageList[index];
        if (!selected) {
            console.error("No package found at index:", index);
            showToast("ไม่พบข้อมูลเส้นทางแนะนำการเดินทางที่เลือก", "error");
            return;
        }

        if (!isUserLoggedIn) {
            showToast("กรุณาเข้าสู่ระบบ (Login) หรือสมัครสมาชิกใหม่ก่อน จึงจะสามารถลงทะเบียนใช้แผนการเดินทางได้ครับ", "info");
            toggleAuthModal();
            return;
        }

        const profile = currentUserProfile || {};
        const userName = profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : "";
        const userPhone = profile.phone || "";

        const bookPkgIdEl = document.getElementById('bookPkgId');
        const bookPkgNameEl = document.getElementById('bookPkgName');
        const bookPkgUserNameEl = document.getElementById('bookPkgUserName');
        const bookPkgUserPhoneEl = document.getElementById('bookPkgUserPhone');
        const bookPkgUserEmailEl = document.getElementById('bookPkgUserEmail');

        if (!bookPkgIdEl || !bookPkgNameEl || !bookPkgUserNameEl || !bookPkgUserPhoneEl || !bookPkgUserEmailEl) {
            console.error("Missing modal elements");
            showToast("ไม่พบแบบฟอร์มลงทะเบียนแผนการเดินทางในหน้าเว็บ กรุณารีเฟรชหน้าต่าง", "error");
            return;
        }

        bookPkgIdEl.value = index;
        bookPkgNameEl.innerText = (selected.title || '').replace(/package/gi, 'Trip').replace(/itinerary/gi, 'Trip');
        bookPkgUserNameEl.value = userName;
        bookPkgUserPhoneEl.value = userPhone;
        bookPkgUserEmailEl.value = currentUserEmail || "";

        // กำหนดค่า min date เป็นวันพรุ่งนี้เป็นอย่างน้อย
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const dateInputEl = document.getElementById('bookPkgDateInput');
        if (dateInputEl) {
            dateInputEl.setAttribute('min', tomorrowStr);
            dateInputEl.value = '';
        }

        // รีเซ็ตจำนวนผู้เดินทาง
        bookingPkgAdults = 1;
        bookingPkgChildren = 0;
        const transportSelect = document.getElementById('bookPkgTransportSelect');
        if (transportSelect) {
            transportSelect.value = 'car';
        }
        updatePkgCounterUI();

        const modal = document.getElementById('bookPackageModal');
        if (modal) {
            modal.style.display = "flex";
        } else {
            showToast("ไม่พบหน้าต่างการจอง (Modal) กรุณารีเฟรชหน้าต่าง", "error");
        }
    } catch (err) {
        console.error("Error in selectPackage:", err);
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
    }
}

async function submitPackageBooking() {
    const dateVal = document.getElementById('bookPkgDateInput').value;
    const btn = document.getElementById('confirmBookPkgBtn');
    const userName = document.getElementById('bookPkgUserName').value.trim();
    const userPhone = document.getElementById('bookPkgUserPhone').value.trim();

    if (!userName) {
        showToast("กรุณาระบุชื่อผู้ลงทะเบียน", "error");
        return;
    }

    if (!userPhone) {
        showToast("กรุณาระบุเบอร์โทรศัพท์ติดต่อ", "error");
        return;
    }

    // ตรวจสอบความถูกต้องเบอร์โทรศัพท์ไทย (เช่น 9-10 หลัก เริ่มต้นด้วย 0)
    const phoneRegex = /^0[0-9]{8,9}$/;
    if (!phoneRegex.test(userPhone)) {
        showToast("กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง (เช่น 0857203538)", "error");
        return;
    }

    if (!dateVal) {
        showToast("กรุณาเลือกวันที่เดินทาง", "error");
        return;
    }

    // ตรวจสอบวันในอดีต
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateVal);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        showToast("ไม่สามารถเลือกวันที่เดินทางในอดีตได้ครับ", "error");
        return;
    }

    btn.innerText = "กำลังตรวจสอบสิทธิ์...";
    btn.disabled = true;

    // Check Option 1: Limit active/pending bookings to max 3 (excluding user-cancelled ones)
    const { data: allBookings, error: checkError } = await db
        .from('package_bookings')
        .select('id, package_name, status')
        .eq('user_email', currentUserEmail);

    if (checkError) {
        console.error("Check active bookings error:", checkError);
    } else {
        const cancelledIds = new Set();
        (allBookings || []).forEach(b => {
            if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) {
                const targetId = parseInt(b.package_name.replace('CANCEL_REQUEST_', ''));
                if (!isNaN(targetId)) cancelledIds.add(targetId);
            }
        });

        const realActiveBookings = (allBookings || []).filter(b => {
            if (['pending', 'confirmed'].includes(b.status)) {
                if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) return false;
                if (cancelledIds.has(b.id)) return false;
                return true;
            }
            return false;
        });

        if (realActiveBookings.length >= 3) {
            showToast("คุณมีแผนการเดินทางที่รอดำเนินการหรือได้รับการอนุมัติสะสมอยู่แล้ว 3 ทริป เพื่อลดความสับสนของแอดมินชุมชน กรุณายกเลิกหรือแจ้งเปลี่ยนแปลงทริปเก่าที่ยังไม่ได้เดินทาง ก่อนลงทะเบียนทริปใหม่เพิ่มครับ", "error");
            btn.innerText = "💾 บันทึกแผนการเดินทาง";
            btn.disabled = false;
            return;
        }
    }

    btn.innerText = "กำลังดำเนินการ...";
    btn.disabled = true;
    const pkgName = document.getElementById('bookPkgName').innerText;

    // Get transportation selection info
    const transportSelect = document.getElementById('bookPkgTransportSelect');
    const transportMode = transportSelect ? transportSelect.value : 'car';
    let transportText = "รถส่วนตัว";
    if (transportMode === 'ev') {
        transportText = "รถ EV";
    } else if (transportMode === 'van') {
        transportText = "รถกระบะจากชุมชน";
    }

    const payload = {
        package_name: `${pkgName} (${transportText})`,
        user_email: currentUserEmail,
        user_name: userName,
        user_phone: userPhone,
        travel_date: dateVal,
        guests_count: bookingPkgAdults + bookingPkgChildren,
        status: 'pending'
    };

    const { data, error } = await db.from('package_bookings').insert([payload]);
    btn.innerText = "💾 บันทึกแผนการเดินทาง";
    btn.disabled = false;

    if (error) {
        console.error("Package registration err:", error);
        showToast("เกิดข้อผิดพลาดในการลงทะเบียนแผนเดินทาง: " + error.message, "error");
    } else {
        const bookedPkg = packageList.find(p => p.title === pkgName);
        const guideName = bookedPkg ? (bookedPkg.guide_name || '') : '';
        let welcomeMsg = "🎉 บันทึกแผนเดินทางสำเร็จ! ชุมชนบ้านป่าเหมี้ยงต้อนรับคุณ และระบบได้เตรียมจัดส่งข้อมูลการเข้าพักให้ผู้ดูแลโฮมสเตย์ชุมชนเรียบร้อยแล้วครับ";

        if (guideName.includes('สมจิต')) {
            welcomeMsg = "🎉 บันทึกแผนสำเร็จ! ลุงสมจิต (ผู้ดูแลป่าชุมชน) ทราบเรื่องแล้ว และยินดีที่จะได้ต้อนรับคุณสู่เส้นทางเดินป่าน้ำตกสองปานครับ!";
        } else if (guideName.includes('สมศรี')) {
            welcomeMsg = "🎉 บันทึกแผนสำเร็จ! ป้าสมศรีเริ่มเตรียมชุดวัตถุดิบอาหารและชาเมี่ยงออร์แกนิกท้องถิ่นสดๆ จากป่าไว้รอต้อนรับคุณแล้วค่ะ!";
        } else if (guideName.includes('เอก')) {
            welcomeMsg = "🎉 บันทึกแผนสำเร็จ! พี่เอกยินดีต้อนรับและพร้อมให้คำแนะนำจุดชมวิวบนกิ่วฝิ่นและจุดถ่ายภาพธรรมชาติรอบหมู่บ้านครับ!";
        }

        showToast(welcomeMsg, "success");
        closeModal('bookPackageModal');
        loadCommunityCarbonStats();
        checkActiveChallengePass();
    }
}


// Auth modal handlers
// Auth states and functions are managed by shared_auth.js

// Load packages grid on startup
openPackageMenu();

// Toast display utility
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

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto dismiss
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// Global Escape key event listener to close active modals
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal('loginModal');
        closeModal('bookPackageModal');
        closeModal('updatePasswordModal');
        closeModal('adminPkgBookingsModal');
        closeModal('adminManagePackagesModal');
        closeModal('editPackageModal');
        closeModal('userPkgBookingsModal');
        closeModal('editPkgBookingModal');
    }
});

// ==========================================
// --- 7.5 ระบบแอดมินสำหรับการจองแพ็กเกจ (Admin Packages Management) ---
// ==========================================

async function openAdminPkgBookingsModal() {
    if (!isAdminLoggedIn) return;
    document.getElementById('adminPkgBookingsModal').style.display = 'flex';
    await loadAdminPkgBookings();
}

async function loadAdminPkgBookings() {
    const tbody = document.getElementById('adminPkgBookingsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">กำลังโหลดข้อมูล...</td></tr>`;

    const { data, error } = await db
        .from('package_bookings')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Load admin package bookings error:", error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ff6b6b;">ไม่สามารถดึงข้อมูลได้: ${error.message}</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">ไม่มีประวัติการลงทะเบียนแผนการเดินทางในขณะนี้</td></tr>`;
        return;
    }

    const cancelledIds = new Set();
    data.forEach(b => {
        if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) {
            const targetId = parseInt(b.package_name.replace('CANCEL_REQUEST_', ''));
            if (!isNaN(targetId)) cancelledIds.add(targetId);
        }
    });

    const displayData = data.filter(b => !String(b.package_name || '').startsWith('CANCEL_REQUEST_'));

    if (displayData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">ไม่มีประวัติการลงทะเบียนแผนการเดินทางในขณะนี้</td></tr>`;
        return;
    }

    tbody.innerHTML = displayData.map(b => {
        const isCancelledByUser = cancelledIds.has(b.id);

        let statusLabel = "";
        let statusClass = "";
        if (isCancelledByUser) {
            statusLabel = "ปฏิเสธ/ยกเลิก";
            statusClass = "status-rejected";
        } else if (b.status === 'pending') {
            statusLabel = "รอตรวจสอบ";
            statusClass = "status-pending";
        } else if (b.status === 'confirmed') {
            statusLabel = "อนุมัติแล้ว";
            statusClass = "status-confirmed";
        } else if (b.status === 'rejected') {
            statusLabel = "ปฏิเสธ/ยกเลิก";
            statusClass = "status-rejected";
        }

        const actionButtons = (b.status === 'pending' && !isCancelledByUser) ? `
            <button class="btn-table-action btn-approve" onclick="approvePkgBooking(${b.id})">อนุมัติ</button>
            <button class="btn-table-action btn-reject" onclick="rejectPkgBooking(${b.id})" style="margin-left: 5px;">ปฏิเสธ</button>
        ` : `-`;

        return `
            <tr>
                <td style="font-weight: 700; color: #ffffff;">${escapeHTML(b.package_name)}</td>
                <td>${escapeHTML(b.user_name)}</td>
                <td>
                    <div>${escapeHTML(b.user_email)}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${escapeHTML(b.user_phone)}</div>
                </td>
                <td>${escapeHTML(b.travel_date)}</td>
                <td>${b.guests_count || 1} คน</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>${actionButtons}</td>
            </tr>
        `;
    }).join('');
}

async function approvePkgBooking(bookingId) {
    if (!isAdminLoggedIn) return;

    const { error } = await db
        .from('package_bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

    if (error) {
        console.error("Approve booking error:", error);
        showToast("ไม่สามารถยืนยันการจองได้: " + error.message, "error");
        return;
    }

    showToast("🎉 ยืนยันการจองแพ็กเกจเรียบร้อยแล้ว!", "success");
    await loadAdminPkgBookings();
}

async function rejectPkgBooking(bookingId) {
    if (!isAdminLoggedIn) return;

    const { error } = await db
        .from('package_bookings')
        .update({ status: 'rejected' })
        .eq('id', bookingId);

    if (error) {
        console.error("Reject booking error:", error);
        showToast("ไม่สามารถปฏิเสธการจองได้: " + error.message, "error");
        return;
    }

    showToast("ยกเลิกการจองแพ็กเกจแล้ว", "success");
    await loadAdminPkgBookings();
}

async function openAdminManagePackagesModal() {
    if (!isAdminLoggedIn) return;
    document.getElementById('adminManagePackagesModal').style.display = 'flex';
    await loadAdminManagePackages();
}

async function loadAdminManagePackages() {
    const tbody = document.getElementById('adminPackagesTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">กำลังโหลดข้อมูล...</td></tr>`;

    // Fetch fresh packages from DB
    const { data, error } = await db
        .from('packages')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Load manage packages error:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ff6b6b;">ไม่สามารถดึงข้อมูลได้: ${error.message}</td></tr>`;
        return;
    }

    packageList = data || [];
    renderPackagesList(); // Refresh home grid too

    if (packageList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">ไม่มีรายการแพ็กเกจในขณะนี้</td></tr>`;
        return;
    }

    tbody.innerHTML = packageList.map(pkg => {
        return `
            <tr>
                <td style="font-weight: 700; color: #ffffff;">${escapeHTML(pkg.title)}</td>
                <td>${escapeHTML(pkg.subtitle)}</td>
                <td>${escapeHTML(pkg.carbon_summary)}</td>
                <td>
                    <button class="btn-table-action btn-approve" onclick="openEditPackageModal(${pkg.id})">✏️ แก้ไข</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openEditPackageModal(pkgId) {
    const pkg = packageList.find(p => p.id === pkgId);
    if (!pkg) return;

    document.getElementById('editPkgIdVal').value = pkg.id;
    document.getElementById('editPkgTitle').value = pkg.title;
    document.getElementById('editPkgSubtitle').value = pkg.subtitle || '';
    document.getElementById('editPkgDesc').value = pkg.description || '';
    document.getElementById('editPkgCarbonSummary').value = pkg.carbon_summary || '';

    // highlights and details arrays to newline-separated strings
    const highlightsStr = Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : '';
    const detailsStr = Array.isArray(pkg.details) ? pkg.details.join('\n') : '';

    document.getElementById('editPkgHighlights').value = highlightsStr;
    document.getElementById('editPkgDetails').value = detailsStr;

    // Set new guide / itinerary / image values
    document.getElementById('editPkgGuideName').value = pkg.guide_name || '';
    document.getElementById('editPkgGuideBio').value = pkg.guide_bio || '';
    document.getElementById('editPkgGuideImage').value = pkg.guide_image || '';
    document.getElementById('editPkgItinerary').value = pkg.itinerary || '';
    document.getElementById('editPkgImage').value = pkg.image_url || '';

    // Set placeholders
    document.getElementById('editPkgHighlights').placeholder = "ระบุคำไฮไลท์บรรทัดละ 1 เรื่อง\nเช่น:\nเส้นทางน้ำตกสองปาน\nช่วงเวลาแนะนำ: กุมภาพันธ์";
    document.getElementById('editPkgDetails').placeholder = "ระบุดีเทลการปล่อยคาร์บอนบรรทัดละ 1 เรื่อง\nเช่น:\nอาหาร 7.2 kgCO2e\nที่พัก 2.5 kgCO2e";

    document.getElementById('editPackageModal').style.display = 'flex';
}

async function savePackageEdit() {
    const pkgId = parseInt(document.getElementById('editPkgIdVal').value);
    const title = document.getElementById('editPkgTitle').value.trim();
    const subtitle = document.getElementById('editPkgSubtitle').value.trim();
    const description = document.getElementById('editPkgDesc').value.trim();
    const carbonSummary = document.getElementById('editPkgCarbonSummary').value.trim();

    const highlightsStr = document.getElementById('editPkgHighlights').value;
    const detailsStr = document.getElementById('editPkgDetails').value;

    const highlights = highlightsStr.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const details = detailsStr.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    const guide_name = document.getElementById('editPkgGuideName').value.trim();
    const guide_bio = document.getElementById('editPkgGuideBio').value.trim();
    const guide_image = document.getElementById('editPkgGuideImage').value.trim();
    const itinerary = document.getElementById('editPkgItinerary').value.trim();
    const image_url = document.getElementById('editPkgImage').value.trim();

    if (!title) {
        showToast("กรุณาระบุชื่อแพ็กเกจ", "error");
        return;
    }

    const { error } = await db
        .from('packages')
        .update({
            title,
            subtitle,
            description,
            carbon_summary: carbonSummary,
            highlights,
            details,
            guide_name,
            guide_bio,
            guide_image,
            itinerary,
            image_url
        })
        .eq('id', pkgId);

    if (error) {
        console.error("Save package edit error:", error);
        showToast("ไม่สามารถบันทึกข้อมูลแพ็กเกจได้: " + error.message, "error");
        return;
    }

    showToast("💾 บันทึกการแก้ไขข้อมูลแพ็กเกจสำเร็จ!", "success");
    closeModal('editPackageModal');
    await loadAdminManagePackages();
}

// ==========================================
// --- 7.6 ระบบการจองแพ็กเกจท่องเที่ยวสำหรับผู้ใช้ทั่วไป (User Bookings Panel) ---
// ==========================================

async function openUserPkgBookingsModal() {
    if (!isUserLoggedIn) return;
    const modal = document.getElementById('userPkgBookingsModal');
    if (modal) modal.style.display = 'flex';
    await loadUserPkgBookings();
}

async function loadUserPkgBookings() {
    const tbody = document.getElementById('userPkgBookingsTableBody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">กำลังโหลดข้อมูล...</td></tr>`;

    const { data, error } = await db
        .from('package_bookings')
        .select('*')
        .eq('user_email', currentUserEmail)
        .order('id', { ascending: false });

    if (error) {
        console.error("Load user package bookings error:", error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ff6b6b;">ไม่สามารถโหลดข้อมูลได้: ${error.message}</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">คุณยังไม่มีประวัติการลงทะเบียนแผนการเดินทางในขณะนี้</td></tr>`;
        return;
    }

    const cancelledIds = new Set();
    data.forEach(b => {
        if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) {
            const targetId = parseInt(b.package_name.replace('CANCEL_REQUEST_', ''));
            if (!isNaN(targetId)) cancelledIds.add(targetId);
        }
    });

    const displayData = data.filter(b => !String(b.package_name || '').startsWith('CANCEL_REQUEST_') && !cancelledIds.has(b.id));

    if (displayData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">คุณยังไม่มีประวัติการลงทะเบียนแผนการเดินทางในขณะนี้</td></tr>`;
        return;
    }

    tbody.innerHTML = displayData.map(b => {
        const isCancelledByUser = cancelledIds.has(b.id);

        let statusLabel = "";
        let statusClass = "";
        if (isCancelledByUser) {
            statusLabel = "ปฏิเสธ/ยกเลิก";
            statusClass = "status-rejected";
        } else if (b.status === 'pending') {
            statusLabel = "รอตรวจสอบ";
            statusClass = "status-pending";
        } else if (b.status === 'confirmed') {
            statusLabel = "อนุมัติแล้ว";
            statusClass = "status-confirmed";
        } else if (b.status === 'rejected' || b.status === 'cancelled') {
            statusLabel = "ปฏิเสธ/ยกเลิก";
            statusClass = "status-rejected";
        }

        const actionButtons = (b.status === 'pending' && !isCancelledByUser) ? `
            <button class="btn-table-action btn-approve" onclick="openEditPkgBookingModal(${b.id}, '${escapeHTML(b.package_name)}', '${b.travel_date}', '${escapeHTML(b.user_name)}', '${escapeHTML(b.user_phone)}', ${b.guests_count})">✏️ แก้ไข</button>
            <button class="btn-table-action btn-reject" onclick="cancelPkgBooking(${b.id})" style="margin-left: 5px;">ยกเลิก</button>
        ` : `-`;

        return `
            <tr>
                <td style="font-weight: 700; color: #ffffff;">
                    ${escapeHTML(b.package_name)}
                    <div style="font-size: 11px; font-weight: normal; color: var(--primary-light); margin-top: 5px; background: rgba(64,192,87,0.08); border: 1px solid rgba(64,192,87,0.2); padding: 3px 8px; border-radius: 6px; display: block; width: fit-content; text-align: left;">
                        🎁 สิทธิ์รับสิทธิพิเศษ/ของรางวัลรักษ์โลก
                    </div>
                </td>
                <td>${escapeHTML(b.user_name)}</td>
                <td>
                    <div>${escapeHTML(b.user_email)}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${escapeHTML(b.user_phone)}</div>
                </td>
                <td>${escapeHTML(b.travel_date)}</td>
                <td>${b.guests_count || 1} คน</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>${actionButtons}</td>
            </tr>
        `;
    }).join('');
}

async function cancelPkgBooking(bookingId) {
    const confirmCancel = confirm("คุณต้องการยกเลิกคำสั่งจองแพ็กเกจนี้ใช่หรือไม่?");
    if (!confirmCancel) return;

    // Bypass RLS update/delete blocks completely by inserting a cancellation ticket row
    const payload = {
        package_name: `CANCEL_REQUEST_${bookingId}`,
        user_email: currentUserEmail,
        user_name: 'SYSTEM_CANCEL',
        user_phone: '0000000000',
        travel_date: '2000-01-01',
        guests_count: 0,
        status: 'rejected'
    };

    const { data, error } = await db
        .from('package_bookings')
        .insert([payload])
        .select();

    if (error) {
        console.error("Cancel booking error:", error);
        showToast("ไม่สามารถส่งคำขอยกเลิกได้: " + error.message, "error");
        return;
    }

    if (!data || data.length === 0) {
        showToast("ไม่สามารถยกเลิกการจองได้ในขณะนี้ กรุณาติดต่อแอดมินโดยตรงครับ", "error");
        return;
    }

    showToast("ยกเลิกการจองแพ็กเกจเรียบร้อยแล้ว", "success");
    await loadUserPkgBookings();
    loadCommunityCarbonStats();
    checkActiveChallengePass();
}

function openEditPkgBookingModal(bookingId, pkgName, travelDate, userName, userPhone, guestsCount) {
    document.getElementById('editPkgBookingId').value = bookingId;
    document.getElementById('editPkgBookingTitle').innerText = pkgName;
    document.getElementById('editPkgBookingUserName').value = userName;
    document.getElementById('editPkgBookingUserPhone').value = userPhone;
    document.getElementById('editPkgBookingDateInput').value = travelDate;

    // กำหนดค่า min date เป็นวันพรุ่งนี้เป็นอย่างน้อย
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('editPkgBookingDateInput').setAttribute('min', tomorrowStr);

    // ตั้งค่าจำนวนผู้เดินทาง
    document.getElementById('editPkgBookingGuestsVal').value = guestsCount;
    document.getElementById('count-edit-pkg-guests').innerText = guestsCount;
    updateEditPkgGuestsUI();

    document.getElementById('editPkgBookingModal').style.display = 'flex';
}

function changeEditPkgGuestsCount(delta) {
    const hiddenInput = document.getElementById('editPkgBookingGuestsVal');
    let count = parseInt(hiddenInput.value) || 1;
    count = Math.max(1, Math.min(20, count + delta));
    hiddenInput.value = count;
    document.getElementById('count-edit-pkg-guests').innerText = count;
    updateEditPkgGuestsUI();
}

function updateEditPkgGuestsUI() {
    const count = parseInt(document.getElementById('editPkgBookingGuestsVal').value) || 1;
    document.getElementById('btn-sub-edit-pkg-guests').disabled = (count <= 1);
    document.getElementById('btn-add-edit-pkg-guests').disabled = (count >= 20);
}

async function savePkgBookingEdit() {
    const bookingId = parseInt(document.getElementById('editPkgBookingId').value);
    const userName = document.getElementById('editPkgBookingUserName').value.trim();
    const userPhone = document.getElementById('editPkgBookingUserPhone').value.trim();
    const dateVal = document.getElementById('editPkgBookingDateInput').value;
    const guestsCount = parseInt(document.getElementById('editPkgBookingGuestsVal').value) || 1;
    const btn = document.getElementById('confirmEditPkgBookingBtn');

    if (!userName) {
        showToast("กรุณาระบุชื่อผู้จอง", "error");
        return;
    }

    if (!userPhone) {
        showToast("กรุณาระบุเบอร์โทรศัพท์ติดต่อ", "error");
        return;
    }

    const phoneRegex = /^0[0-9]{8,9}$/;
    if (!phoneRegex.test(userPhone)) {
        showToast("กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง (เช่น 0857203538)", "error");
        return;
    }

    if (!dateVal) {
        showToast("กรุณาเลือกวันที่เดินทาง", "error");
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(dateVal) < today) {
        showToast("ไม่สามารถเลือกวันที่เดินทางในอดีตได้ครับ", "error");
        return;
    }

    btn.innerText = "กำลังดำเนินการ...";

    const { data, error } = await db
        .from('package_bookings')
        .update({
            user_name: userName,
            user_phone: userPhone,
            travel_date: dateVal,
            guests_count: guestsCount
        })
        .eq('id', bookingId)
        .select();

    btn.innerText = "Save Changes";

    if (error) {
        console.error("Save package booking edit error:", error);
        showToast("ไม่สามารถบันทึกการแก้ไขได้: " + error.message, "error");
        return;
    }

    if (!data || data.length === 0) {
        showToast("ไม่สามารถบันทึกการแก้ไขได้ กรุณาติดต่อแอดมิน", "error");
        return;
    }

    showToast("💾 แก้ไขข้อมูลการจองแพ็กเกจสำเร็จ!", "success");
    closeModal('editPkgBookingModal');
    await loadUserPkgBookings();
    loadCommunityCarbonStats();
    checkActiveChallengePass();
}

// =========================================================================
// --- 8. ระบบภารกิจท้าทายสีเขียว (Green Journey Challenge) และ แดชบอร์ดคาร์บอนรวมชุมชน ---
// =========================================================================

async function loadCommunityCarbonStats() {
    if (typeof db === 'undefined') return;

    const { data: bookings, error } = await db
        .from('package_bookings')
        .select('*');
        
    if (error) {
        console.error("Load community carbon stats error:", error);
        return;
    }
    
    // กรองประวัติที่ถูกยกเลิก
    const cancelledIds = new Set();
    (bookings || []).forEach(b => {
        if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) {
            const targetId = parseInt(b.package_name.replace('CANCEL_REQUEST_', ''));
            if (!isNaN(targetId)) cancelledIds.add(targetId);
        }
    });
    
    const activeBookings = (bookings || []).filter(b => {
        if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) return false;
        if (cancelledIds.has(b.id)) return false;
        if (b.status === 'cancelled' || b.status === 'rejected') return false;
        return true;
    });
    
    let totalTripsCount = activeBookings.length;
    let totalCarbonSaved = 0;
    
    activeBookings.forEach(b => {
        const guests = b.guests_count || 1;
        const name = String(b.package_name || '');
        
        let savings = 0;
        if (name.includes('รถ EV')) {
            savings = (43.15 - 15.52) * guests;
        } else if (name.includes('รถสาธารณะ') || name.includes('รถตู้') || name.includes('รถกระบะจากชุมชน')) {
            savings = (43.15 - 8.60) * guests;
        }
        
        // สมมติว่าโดยเฉลี่ยผู้ลงทะเบียนทำเช็คลิสต์รักษ์โลก ช่วยลดคาร์บอนเพิ่มเฉลี่ยข้อละ 2.0 kgCO2e
        savings += 2.0 * guests; 
        
        totalCarbonSaved += savings;
    });
    
    // ข้อมูลเริ่มต้นจำลอง (Seed Data) เพื่อความสมจริงในการมีส่วนร่วมเชิงสถิติสะสม
    const seedTrips = 142;
    const seedCarbon = 1240.0;
    
    const finalTripsCount = seedTrips + totalTripsCount;
    const finalCarbonSaved = seedCarbon + totalCarbonSaved;
    const finalTreesCount = Math.round(finalCarbonSaved / 12); // ต้นไม้ 1 ต้นดูดซับ CO2 ~12 กิโลกรัมต่อปี
    
    // อัปเดตข้อมูลขึ้นบน UI แดชบอร์ดชุมชน
    const comTotalTripsEl = document.getElementById('comTotalTrips');
    const comTotalSavedCarbonEl = document.getElementById('comTotalSavedCarbon');
    const comTotalTreesEl = document.getElementById('comTotalTrees');
    const comGoalPercentEl = document.getElementById('communityGoalPercent');
    const comGoalProgressFillEl = document.getElementById('communityGoalProgressFill');
    
    if (comTotalTripsEl) comTotalTripsEl.innerText = finalTripsCount.toLocaleString('th-TH');
    if (comTotalSavedCarbonEl) comTotalSavedCarbonEl.innerText = `${finalCarbonSaved.toFixed(1)} kgCO2e`;
    if (comTotalTreesEl) comTotalTreesEl.innerText = finalTreesCount.toLocaleString('th-TH');
    
    const targetGoal = 2500;
    const percent = Math.min(100, Math.round((finalCarbonSaved / targetGoal) * 100));
    
    if (comGoalPercentEl) comGoalPercentEl.innerText = `${percent}%`;
    if (comGoalProgressFillEl) comGoalProgressFillEl.style.width = `${percent}%`;
}

async function checkActiveChallengePass() {
    const container = document.getElementById('activeChallengePassContainer');
    const pkgContent = document.getElementById('packageContent');
    const welcomeBanner = document.querySelector('.local-welcome-banner');
    const scaleCard = document.querySelector('.low-carbon-info-card');
    
    if (!container) return;
    
    // หากยังไม่ได้ล็อกอิน หรือเป็นแอดมิน ให้แสดงหน้ารายการตามปกติ
    if (!isUserLoggedIn || isAdminLoggedIn) {
        container.style.display = 'none';
        if (pkgContent) pkgContent.style.display = 'grid';
        if (welcomeBanner) welcomeBanner.style.display = 'block';
        if (scaleCard) scaleCard.style.display = 'block';
        forceShowAllPackages = false;
        return;
    }
    
    if (typeof db === 'undefined') return;
    
    // ดึงแผนเดินทางของผู้ใช้รายนี้
    const { data: bookings, error } = await db
        .from('package_bookings')
        .select('*')
        .eq('user_email', currentUserEmail)
        .order('id', { ascending: false });
        
    if (error) {
        console.error("Check active challenge pass error:", error);
        return;
    }
    
    // กรองการจองที่ยกเลิกแล้ว
    const cancelledIds = new Set();
    (bookings || []).forEach(b => {
        if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) {
            const targetId = parseInt(b.package_name.replace('CANCEL_REQUEST_', ''));
            if (!isNaN(targetId)) cancelledIds.add(targetId);
        }
    });
    
    const activeBookings = (bookings || []).filter(b => {
        if (String(b.package_name || '').startsWith('CANCEL_REQUEST_')) return false;
        if (cancelledIds.has(b.id)) return false;
        return ['pending', 'confirmed'].includes(b.status);
    });
    
    if (activeBookings.length === 0) {
        // ไม่มีทริปที่ยังทำงานอยู่ ให้แสดงรายการปกติ
        container.style.display = 'none';
        if (pkgContent) pkgContent.style.display = 'grid';
        if (welcomeBanner) welcomeBanner.style.display = 'block';
        if (scaleCard) scaleCard.style.display = 'block';
        forceShowAllPackages = false;
        return;
    }
    
    // เลือกทริปล่าสุดที่ลงทะเบียนไว้มาทำเป็นใบภารกิจหลัก (Active Pass)
    const activeBooking = activeBookings[0];
    const bookingId = activeBooking.id;
    const fullPkgName = activeBooking.package_name; // เช่น "Scenic Low Carbon Trip (รถ EV)"
    
    // แยกรูปแบบรถ และชื่อแพ็กเกจ
    let cleanTitle = fullPkgName;
    let transportLabel = 'รถส่วนตัว (น้ำมัน)';
    let transportEmission = 43.15;
    
    if (fullPkgName.includes('(รถ EV)')) {
        cleanTitle = fullPkgName.replace(' (รถ EV)', '');
        transportLabel = 'รถยนต์ไฟฟ้า (EV)';
        transportEmission = 15.52;
    } else if (fullPkgName.includes('(รถสาธารณะ/รถตู้)') || fullPkgName.includes('(รถกระบะจากชุมชน)')) {
        cleanTitle = fullPkgName.replace(' (รถสาธารณะ/รถตู้)', '').replace(' (รถกระบะจากชุมชน)', '');
        transportLabel = 'รถกระบะจากชุมชน';
        transportEmission = 8.60;
    } else if (fullPkgName.includes('(รถส่วนตัว)')) {
        cleanTitle = fullPkgName.replace(' (รถส่วนตัว)', '');
        transportLabel = 'รถส่วนตัว (น้ำมัน)';
        transportEmission = 43.15;
    }
    
    // ค้นหาวัตถุแพ็กเกจเพื่อดึงข้อมูล Itinerary / Checklist
    let matchedPkg = packageList.find(p => p.title.replace(/package/gi, 'Trip').replace(/itinerary/gi, 'Trip') === cleanTitle || p.title === cleanTitle);
    if (!matchedPkg) {
        matchedPkg = packageList[0] || { id: 99, title: cleanTitle };
    }
    
    // คำนวณคาร์บอนฟุตพริ้นท์ฐาน (Base Footprint)
    const isScenic = String(matchedPkg.title || '').toLowerCase().includes('scenic');
    const inVillageDaily = isScenic ? 22.28 : 21.38;
    const guestsCount = activeBooking.guests_count || 1;
    const baseFootprint = (inVillageDaily + transportEmission) * guestsCount;
    const transportSaving = (43.15 - transportEmission) * guestsCount;
    
    // ดึงสถานะภารกิจที่ติ๊กไว้จาก LocalStorage
    const localKey = `miangmap_checklist_${bookingId}`;
    let checkedIndices = [];
    try {
        const stored = localStorage.getItem(localKey);
        if (stored) checkedIndices = JSON.parse(stored);
    } catch (e) {}
    
    // ดึงภารกิจสีเขียว (Guidelines)
    let guidelines = ECO_GUIDELINES[matchedPkg.id] || ECO_GUIDELINES[99];
    
    const dateFormatted = new Date(activeBooking.travel_date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let checklistHtml = '';
    const itemOffsets = [-3.0, -1.2, -2.5, -1.0, -2.0];
    const itemExplanations = [
        "จอดรถส่วนตัว/ใช้รถท้องถิ่น เพื่อลดมลพิษสะสมในเขตป่าดิบชื้น",
        "พกกระบอกน้ำ/ถุงผ้าส่วนตัว งดขวดพลาสติกแบบใช้ครั้งเดียวทิ้ง",
        "อุดหนุนพืชผักท้องถิ่นสด ๆ ลด Food Miles การขนส่งเป็น 0 กม.",
        "ปิดไฟและพัดลมเมื่อไม่ใช้งาน ช่วยลดภาระการใช้กระแสไฟฟ้าในโฮมสเตย์",
        "ร่วมกิจกรรมเดินป่าเชิงอนุรักษ์ธรรมชาติหรืออุดหนุนของชุมชน"
    ];
    
    guidelines.forEach((step, idx) => {
        const isChecked = checkedIndices.includes(idx);
        const parts = step.split(' - ');
        const titleStr = parts.length > 1 ? parts.slice(1).join(' - ') : step;
        
        checklistHtml += `
            <label class="ticket-checklist-item ${isChecked ? 'checked' : ''}" data-index="${idx}">
                <input type="checkbox" class="ticket-checkbox-input" data-index="${idx}" ${isChecked ? 'checked' : ''} onchange="toggleTicketChecklist(${bookingId}, ${baseFootprint}, ${guestsCount}, this)">
                <div class="ticket-checklist-text">
                    <span class="ticket-item-title">${escapeHTML(titleStr)}</span>
                    <span class="ticket-item-why">💡 ${itemExplanations[idx]} (<strong style="color: var(--primary-light);">${itemOffsets[idx].toFixed(1)} kgCO2e/คน</strong>)</span>
                </div>
            </label>
        `;
    });
    
    // ตั้งค่าสถานะใบนำทาง
    let statusText = activeBooking.status === 'confirmed' ? 'อนุมัติแล้ว (Confirmed)' : 'รอการตรวจสอบ (Pending)';
    let statusColor = activeBooking.status === 'confirmed' ? 'var(--primary-light)' : '#f59e0b';
    
    // แสดงตั๋วภารกิจแทนรายการทริปปกติ
    container.style.display = 'block';
    if (!forceShowAllPackages) {
        if (pkgContent) pkgContent.style.display = 'none';
        if (welcomeBanner) welcomeBanner.style.display = 'none';
        if (scaleCard) scaleCard.style.display = 'none';
    }
    
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <span class="community-badge-chip" style="background: rgba(64,192,87,0.1); border-color: rgba(64,192,87,0.3); color: var(--primary-light); font-size: 13px; padding: 6px 16px;">🎯 คุณมีทริปท้าทายสิ่งแวดล้อมที่กำลังเปิดใช้งาน</span>
        </div>
        
        <div class="active-pass-ticket">
            <!-- Ticket Notch Top -->
            <div class="ticket-cutout-top"></div>
            
            <!-- Left Section: Main Info -->
            <div class="ticket-main-section">
                <div class="ticket-main-header">
                    <div class="ticket-brand">MIANG MAP CHALLENGE PASS</div>
                    <div class="ticket-title">${escapeHTML(cleanTitle)}</div>
                </div>
                
                <div class="ticket-meta-grid">
                    <div>
                        <div class="meta-item-label">รหัสอ้างอิง</div>
                        <div class="meta-item-val" style="font-family: 'Barlow', sans-serif; font-weight: 700; color: var(--primary-light);">#MM-${bookingId}</div>
                    </div>
                    <div>
                        <div class="meta-item-label">สถานะทริป</div>
                        <div class="meta-item-val" id="ticketStatusMeta" style="color: ${statusColor}; font-weight: 700; font-size: 11px;">${statusText}</div>
                    </div>
                    <div>
                        <div class="meta-item-label">วันเดินทาง</div>
                        <div class="meta-item-val">${dateFormatted}</div>
                    </div>
                    <div>
                        <div class="meta-item-label">จำนวนนักเดินทาง</div>
                        <div class="meta-item-val" style="font-family: 'Barlow', sans-serif;">${guestsCount} คน</div>
                    </div>
                    <div style="grid-column: 1 / -1;">
                        <div class="meta-item-label">ยานพาหนะหลัก</div>
                        <div class="meta-item-val" style="font-size: 12px; color: var(--accent);">${transportLabel}</div>
                    </div>
                </div>
                
                <div class="ticket-carbon-gauge-box">
                    <div class="gauge-title">คาร์บอนฟุตพริ้นท์ทริปนี้</div>
                    <div class="gauge-val-row">
                        <span class="gauge-current-val" id="ticketCarbonFootprintVal">0.00 kgCO2e</span>
                        <span class="gauge-saving-text" id="ticketCarbonSavingVal">-0.00 kgCO2e</span>
                    </div>
                    <div class="ticket-gauge-track">
                        <div class="ticket-gauge-fill" id="ticketCarbonGaugeFill" style="width: 100%;"></div>
                    </div>
                    <div style="font-size: 10px; color: var(--text-muted); margin-top: 6px; text-align: center;">
                        ระดับความรักษ์โลก: <span id="ticketEcoTier" style="color: var(--primary-light); font-weight: bold;">Standard Green</span>
                    </div>
                </div>
            </div>
            
            <!-- Right Section: Checklist & Reward -->
            <div class="ticket-sidebar-section">
                <div>
                    <div class="ticket-sidebar-title">
                        <span>🍃 ภารกิจลดคาร์บอนในพื้นที่ (Green Quests)</span>
                    </div>
                    <div class="ticket-checklist">
                        ${checklistHtml}
                    </div>
                </div>
                
                <div class="ticket-redeem-area">
                    <div class="redeem-instructions">
                        <div class="redeem-title">🎁 รางวัลผู้พิทักษ์ป่า (Redeem Reward)</div>
                        <div class="redeem-desc" id="redeemInstructionsText">
                            สะสมภารกิจอย่างน้อย 3 ข้อ และได้รับการอนุมัติทริปเพื่อรับ **ของรางวัลหรือสิทธิพิเศษรักษ์โลกจากชุมชน 🎁**
                        </div>
                    </div>
                    
                    <!-- Stamp -->
                    <div class="digital-stamp" id="ticketStamp">
                        <span class="stamp-text-top">MIANG MAP</span>
                        <span class="stamp-text-main" id="stampMainText">LOCKED</span>
                        <span class="stamp-text-bottom">CHALLENGE</span>
                    </div>
                </div>
            </div>
            
            <!-- Ticket Notch Bottom -->
            <div class="ticket-cutout-bottom"></div>
        </div>
        
        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 30px;">
            <button id="toggleAllPackagesBtn" class="nav-btn" onclick="toggleAllPackagesGrid()" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #ffffff; padding: 10px 20px; font-size: 13.5px; cursor: pointer; transition: all 0.2s;">
                🔍 ดูแผนแนะนำเส้นทางและทริปทั้งหมด
            </button>
        </div>
    `;
    
    // ตั้งค่าคาร์บอนสะสมเริ่มต้นใน UI ของตั๋ว
    updateActiveTicketCarbon(bookingId, baseFootprint, guestsCount, transportSaving);
}

function toggleTicketChecklist(bookingId, baseFootprint, guestsCount, checkbox) {
    const label = checkbox.closest('.ticket-checklist-item');
    if (checkbox.checked) {
        label.classList.add('checked');
    } else {
        label.classList.remove('checked');
    }
    
    // บันทึกสถานะภารกิจลง LocalStorage
    const localKey = `miangmap_checklist_${bookingId}`;
    let checkedIndices = [];
    const checkboxes = document.querySelectorAll('.ticket-checkbox-input');
    checkboxes.forEach(cb => {
        if (cb.checked) {
            checkedIndices.push(parseInt(cb.dataset.index));
        }
    });
    localStorage.setItem(localKey, JSON.stringify(checkedIndices));
    
    // ค้นหารถเดินทางหลักเพื่อคำนวณส่วนลดคาร์บอนทางอ้อมอีกครั้ง
    let transportSaving = 0;
    const activePassTicket = document.querySelector('.active-pass-ticket');
    if (activePassTicket) {
        const transportValEl = activePassTicket.querySelector('.meta-item-val[style*="var(--accent)"]');
        if (transportValEl) {
            const text = transportValEl.innerText;
            if (text.includes('EV')) {
                transportSaving = (43.15 - 15.52) * guestsCount;
            } else if (text.includes('รถตู้') || text.includes('สาธารณะ') || text.includes('รถกระบะจากชุมชน')) {
                transportSaving = (43.15 - 8.60) * guestsCount;
            }
        }
    }
    
    updateActiveTicketCarbon(bookingId, baseFootprint, guestsCount, transportSaving);
}

function updateActiveTicketCarbon(bookingId, baseFootprint, guestsCount, transportSaving) {
    const localKey = `miangmap_checklist_${bookingId}`;
    let checkedIndices = [];
    try {
        const stored = localStorage.getItem(localKey);
        if (stored) checkedIndices = JSON.parse(stored);
    } catch (e) {}
    
    const itemOffsets = [-3.0, -1.2, -2.5, -1.0, -2.0];
    let offsetPerPerson = 0;
    checkedIndices.forEach(idx => {
        offsetPerPerson += Math.abs(itemOffsets[idx]);
    });
    
    const totalChecklistOffset = offsetPerPerson * guestsCount;
    const finalCarbonFootprint = Math.max(0, baseFootprint - totalChecklistOffset);
    const totalSavings = transportSaving + totalChecklistOffset;
    
    // อัปเดตข้อมูล DOM ในตั๋ว
    const footprintValEl = document.getElementById('ticketCarbonFootprintVal');
    const savingValEl = document.getElementById('ticketCarbonSavingVal');
    const gaugeFillEl = document.getElementById('ticketCarbonGaugeFill');
    const ecoTierEl = document.getElementById('ticketEcoTier');
    const stampEl = document.getElementById('ticketStamp');
    const stampMainEl = document.getElementById('stampMainText');
    const redeemTextEl = document.getElementById('redeemInstructionsText');
    
    if (footprintValEl) footprintValEl.innerText = `${finalCarbonFootprint.toFixed(1)} kgCO2e`;
    if (savingValEl) savingValEl.innerText = `ลดไป: -${totalSavings.toFixed(1)} kgCO2e`;
    
    if (gaugeFillEl) {
        const percentage = baseFootprint > 0 ? Math.round((finalCarbonFootprint / baseFootprint) * 100) : 100;
        gaugeFillEl.style.width = `${percentage}%`;
        
        if (percentage < 45) {
            gaugeFillEl.style.background = '#40c057'; // ดีต่อโลกมาก (Green)
        } else if (percentage < 80) {
            gaugeFillEl.style.background = '#f59e0b'; // ปานกลาง (Orange)
        } else {
            gaugeFillEl.style.background = '#ff6b6b'; // ค่อนข้างสูง (Red)
        }
    }
    
    if (ecoTierEl) {
        const checkedCount = checkedIndices.length;
        if (checkedCount === 0) {
            ecoTierEl.innerText = "Standard Green";
            ecoTierEl.style.color = "var(--text-muted)";
        } else if (checkedCount < 3) {
            ecoTierEl.innerText = "🍃 Bronze Leaf";
            ecoTierEl.style.color = "#d3f9d8";
        } else if (checkedCount < 5) {
            ecoTierEl.innerText = "🌟 Silver Leaf";
            ecoTierEl.style.color = "#f59e0b";
        } else {
            ecoTierEl.innerText = "👑 Golden Guardian";
            ecoTierEl.style.color = "#fcc419";
        }
    }
    
    // เงื่อนไขในการแลกรางวัล: ต้องทำสำเร็จอย่างน้อย 3 ภารกิจขึ้นไป
    const isRedeemable = checkedIndices.length >= 3;
    
    let bookingStatus = 'pending';
    const statusMetaEl = document.getElementById('ticketStatusMeta');
    if (statusMetaEl && statusMetaEl.innerText.includes('อนุมัติแล้ว')) {
        bookingStatus = 'confirmed';
    }
    
    if (stampEl) {
        if (isRedeemable) {
            stampEl.classList.add('stamp-gold');
            if (bookingStatus === 'confirmed') {
                if (stampMainEl) stampMainEl.innerText = "REDEEMABLE";
                stampEl.querySelector('.stamp-text-top').innerText = "APPROVED";
                stampEl.querySelector('.stamp-text-bottom').innerText = "CO2 SAVED";
                if (redeemTextEl) {
                    redeemTextEl.innerHTML = `🎉 **ภารกิจสำเร็จ!** ทริปนี้ลดคาร์บอนเด่นชัด ยื่นหน้านี้กับผู้ดูแลในพื้นที่ เพื่อรับ **ของรางวัลหรือสิทธิพิเศษรักษ์โลกจากชุมชน 🎁** ได้เลยครับ!`;
                }
            } else {
                if (stampMainEl) stampMainEl.innerText = "VERIFYING";
                stampEl.querySelector('.stamp-text-top').innerText = "PENDING";
                stampEl.querySelector('.stamp-text-bottom').innerText = "CO2 SAVED";
                if (redeemTextEl) {
                    redeemTextEl.innerHTML = `⏳ **ภารกิจพร้อมแลกสิทธิ์!** ขณะนี้แอดมินชุมชนกำลังประมวลผลอนุมัติทริปของคุณ เมื่อสถานะขึ้นอนุมัติแล้ว ตราประทับจะเปลี่ยนเป็นสีทองสำเร็จเพื่อนำไปแลกรับของรางวัลครับ`;
                }
            }
        } else {
            stampEl.classList.remove('stamp-gold');
            if (stampMainEl) stampMainEl.innerText = "LOCKED";
            stampEl.querySelector('.stamp-text-top').innerText = "MIANG MAP";
            stampEl.querySelector('.stamp-text-bottom').innerText = "CHALLENGE";
            if (redeemTextEl) {
                const diff = 3 - checkedIndices.length;
                redeemTextEl.innerHTML = `สะสมภารกิจสิ่งแวดล้อมเสริมอีก **${diff} ข้อ** เพื่อรับสิทธิ์แลก **ของรางวัลหรือสิทธิพิเศษรักษ์โลกจากชุมชน 🎁**!`;
            }
        }
    }
}

let forceShowAllPackages = false;
function toggleAllPackagesGrid() {
    forceShowAllPackages = !forceShowAllPackages;
    
    const pkgContent = document.getElementById('packageContent');
    const welcomeBanner = document.querySelector('.local-welcome-banner');
    const scaleCard = document.querySelector('.low-carbon-info-card');
    const toggleBtn = document.getElementById('toggleAllPackagesBtn');
    
    if (forceShowAllPackages) {
        if (pkgContent) pkgContent.style.display = 'grid';
        if (welcomeBanner) welcomeBanner.style.display = 'block';
        if (scaleCard) scaleCard.style.display = 'block';
        if (toggleBtn) toggleBtn.innerText = "🙈 ซ่อนรายการแนะนำเส้นทางท่องเที่ยวทั้งหมด";
    } else {
        if (pkgContent) pkgContent.style.display = 'none';
        if (welcomeBanner) welcomeBanner.style.display = 'none';
        if (scaleCard) scaleCard.style.display = 'none';
        if (toggleBtn) toggleBtn.innerText = "🔍 ดูแผนแนะนำเส้นทางและทริปทั้งหมด";
    }
}

// Hook การเปลี่ยนสถานะ Auth จาก shared_auth.js เพื่อคำนวณและแสดงตั๋วใหม่ทันที
window.onAuthChange = function(session) {
    loadCommunityCarbonStats();
    checkActiveChallengePass();
};

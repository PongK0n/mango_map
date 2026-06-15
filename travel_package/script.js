// script.js - Packages Page Logic

const { createClient } = supabase;
const supabaseUrl = "https://siuxbtxvpsntzumcmzjb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdXhidHh2cHNudHp1bWNtempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzc3NzYsImV4cCI6MjA4NjkxMzc3Nn0.Hn2Nuut3JszHzDpbHFB3W4nPaW0eH9tVVdLSOU7GUNY";
const db = createClient(supabaseUrl, supabaseKey);

let isUserLoggedIn = false;
let isAdminLoggedIn = false;
let currentUserEmail = "";
let currentUserProfile = {};
const ADMIN_EMAIL = 'miangmap@gmail.com';

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const packageList = [
    {
        title: 'Adventure Package',
        subtitle: 'สำหรับคนชอบ Adventure',
        description: 'เน้นการใช้แรงขาแทนเครื่องยนต์เพื่อลดการปล่อยคาร์บอน และสัมผัสระบบนิเวศธรรมชาติ',
        highlights: [
            'ช่วงเวลาแนะนำ: พฤศจิกายน - กุมภาพันธ์',
            'เส้นทางหมู่บ้าน - กิ่วฝิ่น: ระยะทางประมาณ 3 กม. ทางชันระดับปานกลาง',
            'เส้นทางน้ำตกแม่ก๋า: เดินลัดเลาะลำธารและป่าดิบเขา',
            'Low Carbon Tip: พกกระติกน้ำส่วนตัวและถุงเก็บขยะ (Plogging)'
        ],
        carbonSummary: 'รวม 14.1 kgCO2e',
        details: ['รถส่วนตัว ลำปาง-ป่าเหมี้ยง 8.4 kgCO2e', 'อาหาร 3.2 kgCO2e', 'ที่พักแบบพัดลม 2.5 kgCO2e', 'กิจกรรมเดินป่า 0 kgCO2e']
    },
    {
        title: 'Foodie Package',
        subtitle: 'สำหรับคนชอบกิน',
        description: 'เน้นอาหารตามฤดูกาลและของท้องถิ่น ลด Food Miles ด้วยวัตถุดิบภายในรัศมี 0 กิโลเมตร',
        highlights: [
            'ช่วงเวลาแนะนำ: มิถุนายน - กันยายน',
            'เมนูห้ามพลาด: ยำใบเหมี้ยง, ไข่ป่าเหมี้ยง, เมนูประจำภาคเหนือ, กาแฟดริปมือ',
            'Low Carbon Tip: เลือกทานอาหารที่โฮมสเตย์จัดให้ เพราะมาจากสวนหลังบ้านหรือป่ารอบๆ'
        ],
        carbonSummary: 'รวม 24.9 kgCO2e',
        details: ['รถส่วนตัว ลำปาง-ป่าเหมี้ยง 8.4 kgCO2e', 'อาหาร 7.2 kgCO2e', 'ที่พักแบบพัดลม 2.5 kgCO2e', 'กิจกรรม workshop ทำกาแฟ 1.2 kgCO2e']
    },
    {
        title: 'Scenic Package',
        subtitle: 'สำหรับคนชอบวิว',
        description: 'Slow Travel ดื่มด่ำกับวิวและแสงธรรมชาติ เหมาะสำหรับการหยุดพักชมบรรยากาศ',
        highlights: [
            'ช่วงเวลาแนะนำ: กุมภาพันธ์ (ดอกเสี้ยวบาน) และ สิงหาคม - ตุลาคม (นาขั้นบันไดและทะเลหมอก)',
            'จุดชมวิว: กิ่วฝิ่น, ลานวัฒนธรรมหมู่บ้าน, เก็บกาแฟ-ชาและแปรรูปเมล็ดกาแฟ',
            'Low Carbon Tip: เลือกพักโฮมสเตย์ที่มีวิวจากระเบียงห้อง เพื่อลดการเดินทางซ้ำซ้อน'
        ],
        carbonSummary: 'รวม 24.9 kgCO2e',
        details: ['รถส่วนตัวและขับไปสถานที่ต่างๆ 16 kgCO2e', 'อาหาร 5.6 kgCO2e', 'ที่พักแบบพัดลม 2.5 kgCO2e', 'กิจกรรมชมวิว 0.8 kgCO2e']
    }
];

function toggleHamburger() {
    document.getElementById('hamburgerBtn').classList.toggle('open');
    document.getElementById('hamburgerMenu').classList.toggle('open');
    document.getElementById('hamburgerBackdrop').classList.toggle('open');
}

function goHome() {
    window.location.href = '../home/index.html';
}

function getPackageHtml(pkg, index) {
    const safeTitle = escapeHTML(pkg.title);
    const safeSubtitle = escapeHTML(pkg.subtitle);
    const safeDesc = escapeHTML(pkg.description);
    const safeCarbon = escapeHTML(pkg.carbonSummary);

    return `
        <div class="package-card">
            <div class="package-card-header" onclick="togglePackageDetails(${index})">
                <div>
                    <div class="package-title">${safeTitle}</div>
                    <div class="package-subtitle">${safeSubtitle}</div>
                </div>
            </div>
            <div class="package-summary">${safeDesc}</div>
            <div class="package-details" id="packageDetails${index}">
                <div class="package-subheading">ไฮไลต์สำคัญ</div>
                ${pkg.highlights.map(item => `<div class="package-highlight-item">• ${escapeHTML(item)}</div>`).join('')}
                <div class="package-subheading">รายละเอียด carbon footprint</div>
                <ul class="package-details-list">
                    ${pkg.details.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
                </ul>
                <div class="package-subheading">สรุปการปล่อยคาร์บอน</div>
                <p>${safeCarbon}</p>
            </div>
            <div class="package-action-row">
                <button type="button" class="package-view-btn" onclick="event.stopPropagation(); togglePackageDetails(${index})">ดูรายละเอียด</button>
                <button type="button" class="package-select-btn" onclick="event.stopPropagation(); selectPackage(${index})">เลือกแพ็กเกจนี้</button>
            </div>
        </div>
    `;
}

function openPackageMenu() {
    const section = document.getElementById('packageSection');
    const content = document.getElementById('packageContent');
    content.innerHTML = packageList.map(getPackageHtml).join('');
    section.classList.add('active');
}

function togglePackageDetails(index) {
    const details = document.getElementById(`packageDetails${index}`);
    if (!details) return;
    details.classList.toggle('open');
}

function selectPackage(index) {
    const selected = packageList[index];

    if (!isUserLoggedIn) {
        showToast("กรุณาเข้าสู่ระบบ (Login) หรือสมัครสมาชิกใหม่ก่อน จึงจะสามารถจองแพ็กเกจได้ครับ", "info");
        toggleAuthModal();
        return;
    }

    const userName = currentUserProfile.first_name ? `${currentUserProfile.first_name} ${currentUserProfile.last_name}` : "-";
    const userPhone = currentUserProfile.phone || "-";

    document.getElementById('bookPkgId').value = index;
    document.getElementById('bookPkgName').innerText = selected.title;
    document.getElementById('bookPkgUserName').innerText = userName;
    document.getElementById('bookPkgUserPhone').innerText = "Tel: " + userPhone;
    document.getElementById('bookPkgUserEmail').innerText = currentUserEmail;
    document.getElementById('bookPkgDateInput').value = '';
    document.getElementById('bookPkgGuestsInput').value = 1;
    document.getElementById('bookPackageModal').style.display = "flex";
}

async function submitPackageBooking() {
    const dateVal = document.getElementById('bookPkgDateInput').value;
    const guestsVal = document.getElementById('bookPkgGuestsInput').value;
    const btn = document.getElementById('confirmBookPkgBtn');

    if (!dateVal) {
        showToast("กรุณาเลือกวันที่เดินทาง", "error");
        return;
    }

    btn.innerText = "กำลังดำเนินการ...";
    const pkgName = document.getElementById('bookPkgName').innerText;
    const userName = currentUserProfile.first_name ? `${currentUserProfile.first_name} ${currentUserProfile.last_name}` : currentUserEmail;
    const userPhone = currentUserProfile.phone || '-';

    const payload = {
        package_name: pkgName,
        user_email: currentUserEmail,
        user_name: userName,
        user_phone: userPhone,
        travel_date: dateVal,
        guests_count: parseInt(guestsVal),
        status: 'pending'
    };

    const { data, error } = await db.from('package_bookings').insert([payload]);
    btn.innerText = "Confirm Booking";

    if (error) {
        console.error("Package booking err:", error);
        showToast("เกิดข้อผิดพลาดในการจอง: " + error.message, "error");
    } else {
        showToast("🎉 การจองแพ็กเกจสำเร็จ! เจ้าหน้าที่จะติดต่อกลับไปทางเบอร์โทรศัพท์ที่ให้ไว้ครับ", "success");
        closeModal('bookPackageModal');
    }
}

// Redirect navbar category buttons to the real Map page
function filterMap(category) {
    window.location.href = `../map/index.html?filter=${category}`;
}

function findMyLocation() {
    window.location.href = '../map/index.html?locate=true';
}

// Auth modal handlers
let authMode = 'login'; // 'login', 'signup', 'forgot'

async function toggleAuthModal() {
    if (isUserLoggedIn) {
        const { error } = await db.auth.signOut();
        if (!error) showToast("ออกจากระบบสำเร็จ", "success");
    } else {
        authMode = 'login';
        updateAuthModalUI();
        document.getElementById('emailInput').value = '';
        document.getElementById('passwordInput').value = '';
        document.getElementById('firstNameInput').value = '';
        document.getElementById('lastNameInput').value = '';
        document.getElementById('phoneNumInput').value = '';
        document.getElementById('loginModal').style.display = "flex";
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function updateAuthModalUI() {
    const title = document.getElementById('authModalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleLink = document.getElementById('authToggleLink');
    const forgotLink = document.getElementById('forgotPasswordLink');
    const signupFields = document.getElementById('signupFields');
    const passwordGroup = document.getElementById('passwordFieldGroup');

    if (authMode === 'login') {
        title.innerText = "Login";
        submitBtn.innerText = "Login";
        toggleLink.innerText = "Don't have an account? Sign Up";
        toggleLink.style.display = "inline";
        forgotLink.style.display = "inline";
        signupFields.style.display = "none";
        passwordGroup.style.display = "block";
    } else if (authMode === 'signup') {
        title.innerText = "Sign Up";
        submitBtn.innerText = "Sign Up";
        toggleLink.innerText = "Already have an account? Login";
        toggleLink.style.display = "inline";
        forgotLink.style.display = "none";
        signupFields.style.display = "block";
        passwordGroup.style.display = "block";
    } else if (authMode === 'forgot') {
        title.innerText = "Reset Password";
        submitBtn.innerText = "Send Reset Link";
        toggleLink.innerText = "Back to Login";
        toggleLink.style.display = "inline";
        forgotLink.style.display = "none";
        signupFields.style.display = "none";
        passwordGroup.style.display = "none";
    }
}

function toggleAuthType() {
    if (authMode === 'forgot') {
        authMode = 'login';
    } else {
        authMode = authMode === 'login' ? 'signup' : 'login';
    }
    updateAuthModalUI();
}

function switchToForgotMode() {
    authMode = 'forgot';
    updateAuthModalUI();
}

async function handleAuthAction() {
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passwordInput').value;
    const fName = document.getElementById('firstNameInput').value;
    const lName = document.getElementById('lastNameInput').value;
    const phoneStr = document.getElementById('phoneNumInput').value;
    const submitBtn = document.getElementById('authSubmitBtn');

    if (!email) {
        showToast("กรุณากรอกอีเมล", "error");
        return;
    }

    if (authMode !== 'forgot' && !pass) {
        showToast("กรุณากรอกรหัสผ่าน", "error");
        return;
    }

    if (authMode === 'signup' && (!fName || !lName || !phoneStr)) {
        showToast("กรุณากรอก ชื่อ, นามสกุล และเบอร์โทรศัพท์ ให้ครบถ้วน", "error");
        return;
    }

    submitBtn.innerText = "กำลังประมวลผล...";

    let error = null;
    if (authMode === 'signup') {
        const res = await db.auth.signUp({
            email: email,
            password: pass,
            options: {
                data: {
                    first_name: fName,
                    last_name: lName,
                    phone: phoneStr
                }
            }
        });
        error = res.error;
        if (!error) showToast("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ระบบ", "success");
    } else if (authMode === 'login') {
        const res = await db.auth.signInWithPassword({ email: email, password: pass });
        error = res.error;
        if (!error) showToast("เข้าสู่ระบบสำเร็จ!", "success");
    } else if (authMode === 'forgot') {
        const redirectUrl = window.location.origin + window.location.pathname;
        const res = await db.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
        error = res.error;
        if (!error) showToast("ส่งลิงก์รีเซตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว!", "success");
    }

    if (error) {
        showToast("เกิดข้อผิดพลาด: " + error.message, "error");
        updateAuthModalUI();
    } else {
        document.getElementById('emailInput').value = '';
        document.getElementById('passwordInput').value = '';
        closeModal('loginModal');
    }
}

async function handleUpdatePassword() {
    const newPassword = document.getElementById('newPasswordInput').value;
    const updateBtn = document.getElementById('updatePasswordBtn');

    if (!newPassword || newPassword.length < 6) {
        showToast("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร", "error");
        return;
    }

    updateBtn.innerText = "กำลังบันทึก...";

    const { error } = await db.auth.updateUser({ password: newPassword });

    updateBtn.innerText = "Update Password";

    if (error) {
        showToast("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน: " + error.message, "error");
    } else {
        showToast("เปลี่ยนรหัสผ่านสำเร็จแล้ว! สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที", "success");
        closeModal('updatePasswordModal');
    }
}

// Listen to Supabase Auth State Changes
db.auth.onAuthStateChange((event, session) => {
    isUserLoggedIn = !!session;
    if (session) {
        currentUserEmail = session.user.email;
        currentUserProfile = session.user.user_metadata || {};
        isAdminLoggedIn = (currentUserEmail === ADMIN_EMAIL);
        document.getElementById('authBtn').innerText = isAdminLoggedIn ? "Logout (Admin)" : "Logout (User)";
    } else {
        currentUserEmail = "";
        currentUserProfile = {};
        isAdminLoggedIn = false;
        document.getElementById('authBtn').innerText = "Login / Sign Up";
    }

    if (event === 'PASSWORD_RECOVERY') {
        // เปิดหน้าต่างตั้งรหัสผ่านใหม่
        document.getElementById('newPasswordInput').value = '';
        document.getElementById('updatePasswordModal').style.display = "flex";
    }
});

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
        closeModal('editModal');
        closeModal('bookModal');
        closeModal('bookPackageModal');
        closeModal('updatePasswordModal');
    }
});

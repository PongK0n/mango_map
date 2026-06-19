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
    renderPackagesList();
}

function renderPackagesList() {
    const content = document.getElementById('packageContent');
    if (!content) return;

    if (packageList.length === 0) {
        content.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1/-1;">ไม่มีข้อมูลแพ็กเกจท่องเที่ยวในขณะนี้</div>`;
        return;
    }

    content.innerHTML = packageList.map((pkg, index) => {
        const highlightsArr = Array.isArray(pkg.highlights) ? pkg.highlights : [];
        const detailsArr = Array.isArray(pkg.details) ? pkg.details : [];

        const safeTitle = escapeHTML(pkg.title);
        const safeSubtitle = escapeHTML(pkg.subtitle);
        const safeDesc = escapeHTML(pkg.description);
        const safeCarbon = escapeHTML(pkg.carbon_summary);

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
                    ${highlightsArr.map(item => `<div class="package-highlight-item">• ${escapeHTML(item)}</div>`).join('')}
                    <div class="package-subheading">รายละเอียด carbon footprint</div>
                    <ul class="package-details-list">
                        ${detailsArr.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
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

function togglePackageDetails(index) {
    const details = document.getElementById(`packageDetails${index}`);
    if (!details) return;
    details.classList.toggle('open');
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
}

function selectPackage(index) {
    try {
        const selected = packageList[index];
        if (!selected) {
            console.error("No package found at index:", index);
            showToast("ไม่พบข้อมูลแพ็กเกจที่เลือก", "error");
            return;
        }

        if (!isUserLoggedIn) {
            showToast("กรุณาเข้าสู่ระบบ (Login) หรือสมัครสมาชิกใหม่ก่อน จึงจะสามารถจองแพ็กเกจได้ครับ", "info");
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
            showToast("ไม่พบหน้าต่างหรือแบบฟอร์มการจองในหน้าเว็บ กรุณารีเฟรชหน้าต่าง", "error");
            return;
        }

        bookPkgIdEl.value = index;
        bookPkgNameEl.innerText = selected.title;
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
        showToast("กรุณาระบุชื่อผู้จอง", "error");
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

    btn.innerText = "กำลังดำเนินการ...";
    const pkgName = document.getElementById('bookPkgName').innerText;

    const payload = {
        package_name: pkgName,
        user_email: currentUserEmail,
        user_name: userName,
        user_phone: userPhone,
        travel_date: dateVal,
        guests_count: bookingPkgAdults + bookingPkgChildren,
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

    // Toggle admin buttons in navbar
    const bookingsBtn = document.getElementById('adminBookingsBtn');
    const managePkgBtn = document.getElementById('adminManagePackagesBtn');
    if (bookingsBtn) bookingsBtn.style.display = isAdminLoggedIn ? 'inline-block' : 'none';
    if (managePkgBtn) managePkgBtn.style.display = isAdminLoggedIn ? 'inline-block' : 'none';

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
        closeModal('bookPackageModal');
        closeModal('updatePasswordModal');
        closeModal('adminPkgBookingsModal');
        closeModal('adminManagePackagesModal');
        closeModal('editPackageModal');
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
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">ไม่มีประวัติการจองแพ็กเกจในขณะนี้</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(b => {
        let statusLabel = "";
        let statusClass = "";
        if (b.status === 'pending') {
            statusLabel = "รอตรวจสอบ";
            statusClass = "status-pending";
        } else if (b.status === 'confirmed') {
            statusLabel = "อนุมัติแล้ว";
            statusClass = "status-confirmed";
        } else if (b.status === 'rejected') {
            statusLabel = "ปฏิเสธ/ยกเลิก";
            statusClass = "status-rejected";
        }

        const actionButtons = b.status === 'pending' ? `
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

    // Set placeholders
    document.getElementById('editPkgHighlights').placeholder = "ระบุคำไฮไลท์บรรทัดละ 1 เรื่อง\nเช่น:\nเส้นทางน้ำตกแม่ก๋า\nช่วงเวลาแนะนำ: กุมภาพันธ์";
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
            details
        })
        .eq('id', pkgId);

    if (error) {
        console.error("Save package edit error:", error);
        showToast("ไม่สามารถบันทึกข้อมูลแพ็กเกจได้: " + error.message, "error");
        return;
    }

    showToast("💾 บันทึกการแก้ไขข้อมูลแพ็กเกจสำเร็จ!", "success");
    closeModal('editPackageModal');
    await loadAdminManagePackages(); // Refresh listing modal
}

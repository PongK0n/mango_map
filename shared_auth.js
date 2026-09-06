// shared_auth.js - Streamlined Map Admin Authentication for MIANG MAP

const supabaseUrl = "https://siuxbtxvpsntzumcmzjb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdXhidHh2cHNudHp1bWNtempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzc3NzYsImV4cCI6MjA4NjkxMzc3Nn0.Hn2Nuut3JszHzDpbHFB3W4nPaW0eH9tVVdLSOU7GUNY";

// Initialize Supabase Client globally
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(supabaseUrl, supabaseKey);
}

// Global authentication state
var isAdminLoggedIn = false;
const ADMIN_EMAIL = 'miangmap@gmail.com';

function openAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        const emailInput = document.getElementById('adminEmailInput');
        const passInput = document.getElementById('adminPasswordInput');
        if (emailInput) emailInput.value = '';
        if (passInput) passInput.value = '';
        modal.style.display = 'flex';
    }
}

function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.style.display = 'none';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

async function handleAdminLogin() {
    const emailInput = document.getElementById('adminEmailInput');
    const passInput = document.getElementById('adminPasswordInput');
    const submitBtn = document.getElementById('adminSubmitBtn');

    const email = emailInput ? emailInput.value.trim() : '';
    const pass = passInput ? passInput.value : '';

    if (!email || !pass) {
        showToast("กรุณากรอกอีเมลและรหัสผ่านผู้ดูแลระบบ", "error");
        return;
    }

    if (submitBtn) submitBtn.innerText = "กำลังเข้าสู่ระบบ...";

    const res = await db.auth.signInWithPassword({ email, password: pass });

    if (res.error) {
        showToast("เข้าสู่ระบบไม่สำเร็จ: " + res.error.message, "error");
        if (submitBtn) submitBtn.innerText = "เข้าสู่ระบบ (Admin)";
        return;
    }

    if (res.data?.user?.email !== ADMIN_EMAIL) {
        await db.auth.signOut();
        showToast("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ (Admin Only)", "error");
        if (submitBtn) submitBtn.innerText = "เข้าสู่ระบบ (Admin)";
        return;
    }

    if (submitBtn) submitBtn.innerText = "เข้าสู่ระบบ (Admin)";
    closeAdminLoginModal();
    showToast("เข้าสู่โหมดผู้ดูแลระบบสำเร็จ! 🔑", "success");
}

async function handleAdminLogout() {
    const confirmLogout = confirm("ต้องการออกจากโหมดผู้ดูแลระบบใช่หรือไม่?");
    if (!confirmLogout) return;

    await db.auth.signOut();
    showToast("ออกจากโหมดผู้ดูแลระบบเรียบร้อยแล้ว", "success");

    // Remove ?admin=true from URL cleanly
    const url = new URL(window.location.href);
    if (url.searchParams.has('admin')) {
        url.searchParams.delete('admin');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
}

// Global Auth State Change handler
db.auth.onAuthStateChange((event, session) => {
    isAdminLoggedIn = !!(session && session.user && session.user.email === ADMIN_EMAIL);

    // Update Floating Admin Badge
    const adminBadge = document.getElementById('adminFloatingBadge');
    if (adminBadge) {
        adminBadge.style.display = isAdminLoggedIn ? 'flex' : 'none';
    }

    // Refresh map if filterMap is available
    if (typeof window.filterMap === 'function') {
        window.filterMap(window.currentFilter || 'all');
    }

    if (typeof window.onAuthChange === 'function') {
        window.onAuthChange(session);
    }
});

// Toast display helper
if (typeof window.showToast === 'undefined') {
    window.showToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

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
        
        toast.offsetHeight;
        toast.classList.add('show');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    };
}

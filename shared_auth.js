// shared_auth.js - Shared Authentication Logic across Home, Map, and Packages pages

const supabaseUrl = "https://siuxbtxvpsntzumcmzjb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdXhidHh2cHNudHp1bWNtempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzc3NzYsImV4cCI6MjA4NjkxMzc3Nn0.Hn2Nuut3JszHzDpbHFB3W4nPaW0eH9tVVdLSOU7GUNY";

// Initialize Supabase Client globally if not already set up
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(supabaseUrl, supabaseKey);
}

// Global authentication states
var isUserLoggedIn = false;
var isAdminLoggedIn = false;
var currentUserEmail = "";
var currentUserProfile = {};
const ADMIN_EMAIL = 'miangmap@gmail.com';

let authMode = 'login'; // 'login', 'signup', 'forgot'

async function toggleAuthModal() {
    if (isUserLoggedIn) {
        const confirmLogout = confirm("คุณต้องการออกจากระบบใช่หรือไม่?");
        if (!confirmLogout) return;
        const { error } = await db.auth.signOut();
        if (!error) showToast("ออกจากระบบสำเร็จ", "success");
    } else {
        authMode = 'login';
        updateAuthModalUI();
        const emailInput = document.getElementById('emailInput');
        if (emailInput) emailInput.value = '';
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) passwordInput.value = '';
        const fNameInput = document.getElementById('firstNameInput');
        if (fNameInput) fNameInput.value = '';
        const lNameInput = document.getElementById('lastNameInput');
        if (lNameInput) lNameInput.value = '';
        const phoneNumInput = document.getElementById('phoneNumInput');
        if (phoneNumInput) phoneNumInput.value = '';
        document.getElementById('loginModal').style.display = "flex";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
}

function updateAuthModalUI() {
    const title = document.getElementById('authModalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleLink = document.getElementById('authToggleLink');
    const forgotLink = document.getElementById('forgotPasswordLink');
    const signupFields = document.getElementById('signupFields');
    const passwordGroup = document.getElementById('passwordFieldGroup');
    const googleContainer = document.getElementById('googleAuthContainer');

    if (authMode === 'login') {
        if (title) title.innerText = "Login";
        if (submitBtn) submitBtn.innerText = "Login";
        if (toggleLink) {
            toggleLink.innerText = "Don't have an account? Sign Up";
            toggleLink.style.display = "inline";
        }
        if (forgotLink) forgotLink.style.display = "inline";
        if (signupFields) signupFields.style.display = "none";
        if (passwordGroup) passwordGroup.style.display = "block";
        if (googleContainer) googleContainer.style.display = "block";
    } else if (authMode === 'signup') {
        if (title) title.innerText = "Sign Up";
        if (submitBtn) submitBtn.innerText = "Sign Up";
        if (toggleLink) {
            toggleLink.innerText = "Already have an account? Login";
            toggleLink.style.display = "inline";
        }
        if (forgotLink) forgotLink.style.display = "none";
        if (signupFields) signupFields.style.display = "block";
        if (passwordGroup) passwordGroup.style.display = "block";
        if (googleContainer) googleContainer.style.display = "block";
    } else if (authMode === 'forgot') {
        if (title) title.innerText = "Reset Password";
        if (submitBtn) submitBtn.innerText = "Send Reset Link";
        if (toggleLink) {
            toggleLink.innerText = "Back to Login";
            toggleLink.style.display = "inline";
        }
        if (forgotLink) forgotLink.style.display = "none";
        if (signupFields) signupFields.style.display = "none";
        if (passwordGroup) passwordGroup.style.display = "none";
        if (googleContainer) googleContainer.style.display = "none";
    }
}

async function handleGoogleLogin() {
    const redirectUrl = window.location.origin + window.location.pathname;
    const { error } = await db.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl
        }
    });
    if (error) {
        showToast("เกิดข้อผิดพลาดในการล็อกอินด้วย Google: " + error.message, "error");
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
    const passwordInput = document.getElementById('passwordInput');
    const pass = passwordInput ? passwordInput.value : '';

    const firstNameInput = document.getElementById('firstNameInput');
    const fName = firstNameInput ? firstNameInput.value : '';
    const lastNameInput = document.getElementById('lastNameInput');
    const lName = lastNameInput ? lastNameInput.value : '';
    const phoneNumInput = document.getElementById('phoneNumInput');
    const phoneStr = phoneNumInput ? phoneNumInput.value : '';

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

    if (submitBtn) submitBtn.innerText = "กำลังประมวลผล...";

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
        updateAuthModalUI(); // รีเซ็ตข้อความปุ่ม
    } else {
        document.getElementById('emailInput').value = '';
        if (passwordInput) passwordInput.value = '';
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

    if (updateBtn) updateBtn.innerText = "กำลังบันทึก...";

    const { error } = await db.auth.updateUser({ password: newPassword });

    if (updateBtn) updateBtn.innerText = "Update Password";

    if (error) {
        showToast("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน: " + error.message, "error");
    } else {
        showToast("เปลี่ยนรหัสผ่านสำเร็จแล้ว! สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที", "success");
        closeModal('updatePasswordModal');
    }
}

// Global Auth State Change handler for navbar sync
db.auth.onAuthStateChange((event, session) => {
    isUserLoggedIn = !!session;
    if (session) {
        currentUserEmail = session.user.email;
        currentUserProfile = session.user.user_metadata || {};
        isAdminLoggedIn = (currentUserEmail === ADMIN_EMAIL);
        const authBtn = document.getElementById('authBtn');
        if (authBtn) authBtn.innerText = isAdminLoggedIn ? "Logout (Admin)" : "Logout (User)";
    } else {
        currentUserEmail = "";
        currentUserProfile = {};
        isAdminLoggedIn = false;
        const authBtn = document.getElementById('authBtn');
        if (authBtn) authBtn.innerText = "Login / Sign Up";
    }

    // Standard buttons visibility toggle
    const bookingsBtn = document.getElementById('adminBookingsBtn');
    const managePkgBtn = document.getElementById('adminManagePackagesBtn');
    const myBookingsBtn = document.getElementById('myBookingsBtn');

    if (bookingsBtn) bookingsBtn.style.display = isAdminLoggedIn ? 'inline-block' : 'none';
    if (managePkgBtn) managePkgBtn.style.display = isAdminLoggedIn ? 'inline-block' : 'none';
    if (myBookingsBtn) myBookingsBtn.style.display = (isUserLoggedIn && !isAdminLoggedIn) ? 'inline-block' : 'none';

    if (event === 'PASSWORD_RECOVERY') {
        const newPasswordInput = document.getElementById('newPasswordInput');
        if (newPasswordInput) newPasswordInput.value = '';
        const updatePasswordModal = document.getElementById('updatePasswordModal');
        if (updatePasswordModal) updatePasswordModal.style.display = "flex";
    }
});

// Toast display helper if not defined
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
        
        // Trigger reflow for transition
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

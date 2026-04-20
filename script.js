// script.js

const { createClient } = supabase;
const supabaseUrl = "https://siuxbtxvpsntzumcmzjb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdXhidHh2cHNudHp1bWNtempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzc3NzYsImV4cCI6MjA4NjkxMzc3Nn0.Hn2Nuut3JszHzDpbHFB3W4nPaW0eH9tVVdLSOU7GUNY";
const db = createClient(supabaseUrl, supabaseKey);

let locations = [];
let isAdminLoggedIn = false;
let isUserLoggedIn = false;
let currentUserEmail = "";
let currentUserProfile = {};
let currentFilter = 'all';
const ADMIN_EMAIL = 'miangmap@gmail.com';

const map = L.map('map').setView([18.83081, 99.38724], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);

let myLocationMarker = null;

function getMarkerIcon(category) {
    let color = 'blue';
    if (category === 'stay') color = 'blue';
    else if (category === 'food') color = 'orange';
    else if (category === 'tour') color = 'green';
    else if (category === 'other') color = 'black';

    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

function filterMap(category) {
    currentFilter = category;
    markersLayer.clearLayers();

    locations.forEach(loc => {
        if (category === 'all' || loc.category === category) {
            const marker = L.marker([loc.lat, loc.lng], {
                draggable: isAdminLoggedIn,
                icon: getMarkerIcon(loc.category)
            });

            if (isAdminLoggedIn) {
                marker.on('dragend', async function (e) {
                    const newPos = e.target.getLatLng();
                    const confirmMove = confirm(`ต้องการย้ายตำแหน่ง "${loc.name}" ใช่หรือไม่?`);

                    if (confirmMove) {
                        const { error } = await db.from('locations').update({
                            lat: newPos.lat,
                            lng: newPos.lng
                        }).eq('id', loc.id);

                        if (error) {
                            alert("เกิดข้อผิดพลาดในการย้าย: " + error.message);
                        } else {
                            alert("บันทึกตำแหน่งใหม่เรียบร้อยแล้ว!");
                        }
                        fetchLocations();
                    } else {
                        fetchLocations();
                    }
                });
            }

            const address = loc.address || "-";
            const phone = loc.phone || "";
            const facebookLink = loc.facebook || "";
            const rating = loc.rating || "-";

            let adminControls = "";
            if (isAdminLoggedIn) {
                adminControls = `<button class="edit-marker-btn" onclick="openEditModal(${loc.id})">✏️ Edit Marker</button>`;
            }

            let bookBtn = "";
            if (loc.category === 'stay') {
                bookBtn = `<button class="book-package-btn" onclick="handleBookPackage(${loc.id}, '${loc.name}')" style="margin-top: 10px; width: 100%; padding: 8px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Barlow', sans-serif; transition: 0.2s;">📅 Book Now</button>`;
            }

            const popupHtml = `
                <div class="g-card">
                    <div class="g-header">Location Info</div>
                    <div class="g-title">${loc.name}</div>
                    <div class="g-address">${address}</div>
                    ${phone ? `<div class="g-link-row"><span class="g-icon">📞</span><a href="tel:${phone}" class="g-link">${phone}</a></div>` : ''}
                    ${facebookLink ? `<div class="g-link-row"><span class="g-icon">📘</span><a href="${facebookLink}" target="_blank" class="g-link">Facebook Page</a></div>` : ''}
                    <div class="g-rating">
                        <span class="g-score">${rating}</span>
                        <span class="g-stars">★★★★☆</span>
                    </div>
                    ${adminControls}
                    ${bookBtn}
                </div>
            `;
            marker.bindPopup(popupHtml);
            markersLayer.addLayer(marker);
        }
    });

    const buttons = document.querySelectorAll('.nav-btn:not(.admin-btn):not(.gps-btn)');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });
}

async function fetchLocations() {
    const { data, error } = await db.from('locations').select('*');
    if (error) {
        console.error("Error fetching data:", error);
        alert("ไม่สามารถโหลดข้อมูลจากฐานข้อมูลได้");
        return;
    }
    locations = data;
    filterMap(currentFilter);
}

async function toggleAuthModal() {
    if (isUserLoggedIn) {
        const { error } = await db.auth.signOut();
        if (!error) alert("ออกจากระบบสำเร็จ");
    } else {
        isSignUpMode = false;
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
    document.getElementById('authModalTitle').innerText = isSignUpMode ? "Sign Up" : "Login";
    document.getElementById('authSubmitBtn').innerText = isSignUpMode ? "Sign Up" : "Login";
    document.getElementById('authToggleLink').innerText = isSignUpMode ? "Already have an account? Login" : "Don't have an account? Sign Up";
    document.getElementById('signupFields').style.display = isSignUpMode ? "block" : "none";
}

function toggleAuthType() {
    isSignUpMode = !isSignUpMode;
    updateAuthModalUI();
}

async function handleAuthAction() {
    const email = document.getElementById('emailInput').value;
    const pass = document.getElementById('passwordInput').value;
    const fName = document.getElementById('firstNameInput').value;
    const lName = document.getElementById('lastNameInput').value;
    const phoneStr = document.getElementById('phoneNumInput').value;
    const submitBtn = document.getElementById('authSubmitBtn');

    if (!email || !pass) {
        alert("กรุณากรอกอีเมลและรหัสผ่าน");
        return;
    }

    if (isSignUpMode && (!fName || !lName || !phoneStr)) {
        alert("กรุณากรอก ชื่อ, นามสกุล และเบอร์โทรศัพท์ ให้ครบถ้วน");
        return;
    }

    submitBtn.innerText = "กำลังประมวลผล...";

    let error = null;
    if (isSignUpMode) {
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
        if (!error) alert("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ระบบ");
    } else {
        const res = await db.auth.signInWithPassword({ email: email, password: pass });
        error = res.error;
        if (!error) alert("เข้าสู่ระบบสำเร็จ!");
    }

    if (error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
        updateAuthModalUI();
    } else {
        document.getElementById('emailInput').value = '';
        document.getElementById('passwordInput').value = '';
        closeModal('loginModal');
    }
}

function handleBookPackage(locId, locName) {
    if (!isUserLoggedIn) {
        alert("กรุณาเข้าสู่ระบบ (Login) หรือสมัครสมาชิกใหม่ก่อน จึงจะสามารถจองที่พักได้ครับ");
        toggleAuthModal();
        return;
    }

    const userName = currentUserProfile.first_name ? `${currentUserProfile.first_name} ${currentUserProfile.last_name}` : "-";
    const userPhone = currentUserProfile.phone || "-";

    document.getElementById('bookLocId').value = locId;
    document.getElementById('bookLocName').innerText = locName;
    document.getElementById('bookUserName').innerText = userName;
    document.getElementById('bookUserPhone').innerText = "Tel: " + userPhone;
    document.getElementById('bookUserEmail').innerText = currentUserEmail;
    document.getElementById('bookDateInput').value = '';
    document.getElementById('bookGuestsInput').value = 1;
    document.getElementById('bookModal').style.display = "flex";
    map.closePopup();
}

async function submitBooking() {
    const dateVal = document.getElementById('bookDateInput').value;
    const guestsVal = document.getElementById('bookGuestsInput').value;
    const btn = document.getElementById('confirmBookBtn');

    if (!dateVal) {
        alert("กรุณาเลือกวันที่เข้าพัก");
        return;
    }

    btn.innerText = "กำลังดำเนินการ...";
    const locId = document.getElementById('bookLocId').value;
    const locName = document.getElementById('bookLocName').innerText;
    const userName = currentUserProfile.first_name ? `${currentUserProfile.first_name} ${currentUserProfile.last_name}` : currentUserEmail;
    const userPhone = currentUserProfile.phone || '-';

    const payload = {
        location_id: parseInt(locId),
        location_name: locName,
        user_email: currentUserEmail,
        user_name: userName,
        user_phone: userPhone,
        travel_date: dateVal,
        guests_count: parseInt(guestsVal),
        status: 'pending'
    };

    const { data, error } = await db.from('bookings').insert([payload]);
    btn.innerText = "Confirm Booking";

    if (error) {
        console.error("Booking err:", error);
        alert("เกิดข้อผิดพลาดในการจอง: " + error.message);
    } else {
        alert("🎉 การจองสำเร็จ! ทางโฮมสเตย์จะติดต่อกลับไปทางเบอร์โทรศัพท์ที่ให้ไว้ครับ");
        closeModal('bookModal');
    }
}

function openEditModal(id) {
    const loc = locations.find(item => item.id === id);
    if (!loc) return;

    document.getElementById('editId').value = loc.id;
    document.getElementById('editName').value = loc.name;
    document.getElementById('editLat').value = loc.lat;
    document.getElementById('editLng').value = loc.lng;
    document.getElementById('editCat').value = loc.category;
    document.getElementById('editPhone').value = loc.phone || "";
    document.getElementById('editFacebook').value = loc.facebook || "";
    document.getElementById('editRating').value = loc.rating || "";
    document.getElementById('editModal').style.display = "flex";
    map.closePopup();
}

async function saveLocationEdit() {
    const updateBtn = document.querySelector('.btn-save');
    updateBtn.innerText = "กำลังบันทึก...";

    const id = document.getElementById('editId').value;
    const updatedData = {
        name: document.getElementById('editName').value,
        lat: parseFloat(document.getElementById('editLat').value),
        lng: parseFloat(document.getElementById('editLng').value),
        category: document.getElementById('editCat').value,
        phone: document.getElementById('editPhone').value,
        facebook: document.getElementById('editFacebook').value,
        rating: document.getElementById('editRating').value
    };

    const { error } = await db.from('locations').update(updatedData).eq('id', id);
    updateBtn.innerText = "Save Changes";

    if (error) {
        alert("เกิดข้อผิดพลาดในการบันทึก: " + error.message);
    } else {
        alert("อัปเดตข้อมูลสำเร็จ!");
        closeModal('editModal');
        fetchLocations();
    }
}

function findMyLocation() {
    map.locate({ setView: true, maxZoom: 16 });
}

map.on('locationfound', function (e) {
    const radius = e.accuracy / 2;
    if (myLocationMarker) map.removeLayer(myLocationMarker);
    myLocationMarker = L.layerGroup([
        L.marker(e.latlng).bindPopup("You are here (within " + radius.toFixed(0) + " m.)").openPopup(),
        L.circle(e.latlng, radius)
    ]).addTo(map);
});

map.on('locationerror', function (e) {
    alert("Cannot access location. Please enable GPS permissions.");
});

fetchLocations();

let isSignUpMode = false;

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
    filterMap(currentFilter);
});

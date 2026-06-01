// ==========================================
// 🔧 UI UTILITIES
// ==========================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

function logout() {
    window.location.href = '/logout';
}

// ==========================================
// 📋 LOAD VICTIM RECORDS (INDEX PAGE)
// ==========================================
function loadVictims() {
    const ul = document.getElementById("ul");
    if (!ul) return;

    fetch("/victimdata")
    .then(res => res.json())
    .then(data => {
        ul.innerHTML = "";
        data.forEach(i => {
            ul.innerHTML += `
            <tr>
                <td><div class="victim-name">${i.name}</div></td>
                <td><div class="victim-meta">${i.gender} • ${i.age} yrs</div></td>
                <td><div style="font-size:13px; color:var(--text-2);">${i.contact}</div></td>
                <td><span class="status-badge status-relief">${i.status}</span></td>
                <td><span class="medical-tag">${i.medical_info}</span></td>
                <td style="font-size:12px; color:var(--text-3);">${i.created_at}</td>
                <td class="table-actions">
                    <a href="/editvictim/${i.id}" class="btn btn-secondary btn-sm">✏</a>
                    <button class="btn btn-danger btn-sm" onclick="deleteVictim('${i.id}', this)">🗑</button>
                </td>
            </tr>
            `;
        });
        document.getElementById("rowCount").textContent = "Showing " + data.length + " records";
    })
    .catch(err => console.log(err));
}

// ==========================================
// ➕ SUBMIT VICTIM (ADD PAGE)
// ==========================================
function submitvictim(event) {
    event.preventDefault();

    const victimData = {
        name:         document.getElementById("name").value,
        age:          document.getElementById("age").value,
        gender:       document.getElementById("gender").value,
        contact:      document.getElementById("contact").value,
        status:       document.getElementById("status").value,
        medical_info: document.getElementById("medical_info").value,
    };

    fetch("/victimssubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(victimData)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        const successAlert = document.getElementById("successMsg");
        if (successAlert) {
            successAlert.style.display = "flex";
            window.scrollTo(0, 0);
            setTimeout(() => { window.location.href = "/victim"; }, 1500);
        }
    })
    .catch(err => console.log(err));
}

// ==========================================
// 🔄 UPDATE VICTIM (EDIT PAGE)
// ==========================================
const victimId = window.location.pathname.split("/").pop();

function updatevictim(event) {
    event.preventDefault();

    const updatedData = {
        name:         document.getElementById("name").value,
        age:          document.getElementById("age").value,
        gender:       document.getElementById("gender").value,
        contact:      document.getElementById("contact").value,
        status:       document.getElementById("status").value,
        medical_info: document.getElementById("medical_info").value,
    };

    fetch(`/updatevictim/${victimId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        const successAlert = document.getElementById("successMsg");
            successAlert.style.display = "flex";
            window.location.href = "/victim";
    })
    .catch(err => console.log(err));
}

// ==========================================
// 🗑 DELETE VICTIM
// ==========================================
function deleteVictim(id) {
    if (!confirm("Delete this victim record?")) return;

    fetch(`/deletevictim/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);

            window.location.href = "/victim";
    })
    .catch(err => console.log(err));
}

// ==========================================
// 🚀 INIT
// ==========================================
loadVictims();
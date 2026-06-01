function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); document.getElementById('overlay').classList.toggle('show'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); }
function logout() { window.location.href = "/logout" }

// ─── LIST PAGE ───

function loadVolunteers() {
    const tbody = document.getElementById("tableBody")
    if (!tbody) return  // sirf list page pe chale

    fetch("/volunteerdata")
    .then(res => res.json())
    .then(data => {
        tbody.innerHTML = ""
        document.getElementById("rowCount").textContent = "Showing " + data.length + " records"
        data.forEach(i => {
            tbody.innerHTML += `
                <tr>
                    <td><b>${i.first_name} ${i.last_name}</b></td>
                    <td>${i.phone}</td>
                    <td>${i.skill}</td>
                    <td>${i.location}</td>
                    <td>${i.organization}</td>
                    <td>${i.start_date}</td>
                    <td><span class="badge badge-success">${i.status}</span></td>
                    <td class="table-actions">
                        <button onclick="window.location.href='/editvolunteer/${i.id}'" class="btn btn-secondary btn-sm">✏</button>
                        <button onclick="deleteVolunteer('${i.id}')" class="btn btn-danger btn-sm">🗑</button>
                    </td>
                </tr>
            `
        })
    })
    .catch(err => console.log(err))
}

function deleteVolunteer(id) {
    if (!confirm("Remove this volunteer?")) return
    fetch(`/deletevolunteer/${id}`)
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        loadVolunteers()  // list reload karo
    })
}

function filterTable() {
    const search = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : ""
    const status = document.getElementById('statusFilter') ? document.getElementById('statusFilter').value.toLowerCase() : ""
    const skill = document.getElementById('skillFilter') ? document.getElementById('skillFilter').value.toLowerCase() : ""
    const rows = document.querySelectorAll('#tableBody tr')
    let visible = 0
    rows.forEach(row => {
        const text = row.textContent.toLowerCase()
        if ((!search || text.includes(search)) && (!status || text.includes(status)) && (!skill || text.includes(skill))) {
            row.style.display = ''; visible++
        } else { row.style.display = 'none' }
    })
    if (document.getElementById('rowCount'))
        document.getElementById('rowCount').textContent = 'Showing ' + visible + ' records'
}

function clearFilters() {
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = ''
    if (document.getElementById('statusFilter')) document.getElementById('statusFilter').value = ''
    if (document.getElementById('skillFilter')) document.getElementById('skillFilter').value = ''
    filterTable()
}

// ─── ADD PAGE ───

function submitvolunteer(event) {
    event.preventDefault()
    if (!document.getElementById("firstName")) return  // sirf add page pe chale

    const data = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        skill: document.getElementById("skill").value,
        organization: document.getElementById("organization").value,
        disaster: document.getElementById("disaster").value,
        location: document.getElementById("location").value,
        start_date: document.getElementById("startDate").value,
        status: document.getElementById("status").value,
        qualifications: document.getElementById("qualifications").value,
        notes: document.getElementById("notes").value,
    }

    fetch("/submitvolunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        window.location.href = "/volunteers"
    })
    .catch(err => console.log(err))
}

// ─── EDIT PAGE ───

function updatevolunteer(event) {
    event.preventDefault()
    if (!document.getElementById("firstName")) return  // sirf edit page pe chale

    const id = window.location.pathname.split("/").pop()
    const data = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        skill: document.getElementById("skill").value,
        organization: document.getElementById("organization").value,
        disaster: document.getElementById("disaster").value,
        location: document.getElementById("location").value,
        start_date: document.getElementById("startDate").value,
        status: document.getElementById("status").value,
        qualifications: document.getElementById("qualifications").value,
        notes: document.getElementById("notes").value,
    }

    fetch(`/updatevolunteer/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        window.location.href = "/volunteers"
    })
    .catch(err => console.log(err))
}

// Page load pe list load karo
window.onload = loadVolunteers
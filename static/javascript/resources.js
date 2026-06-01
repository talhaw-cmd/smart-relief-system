function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

function logout() {
    window.location.href = "/logout"
}

// ─── LIST PAGE ───

function loadResources() {
    const tbody = document.getElementById("tableBody")
    if (!tbody) return

    fetch("/resourcesdata")
    .then(res => res.json())
    .then(data => {
        tbody.innerHTML = ""
        document.getElementById("rowCount").textContent = "Showing " + data.length + " records"

        data.forEach(r => {
            let badgeClass = "badge-success"
            if (r.status === "Low Stock") badgeClass = "badge-warning"
            if (r.status === "Depleted") badgeClass = "badge-danger"

            tbody.innerHTML += `
                <tr>
                    <td><strong>${r.name}</strong></td>
                    <td><span class="badge badge-info">${r.category}</span></td>
                    <td>${r.unit}</td>
                    <td>${r.stock}</td>
                    <td>${r.allocated}</td>
                    <td>${r.facility}</td>
                    <td><span class="badge ${badgeClass}">${r.status}</span></td>
                    <td class="table-actions">
                        <button onclick="window.location.href='/editresource/${r.id}'"
                            class="btn btn-secondary btn-sm">✏</button>
                        <button onclick="deleteResource('${r.id}')"
                            class="btn btn-danger btn-sm">🗑</button>
                    </td>
                </tr>
            `
        })
    })
    .catch(err => console.log(err))
}

function deleteResource(id) {
    if (!confirm("Delete this resource?")) return
    fetch(`/deleteresource/${id}`)
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        loadResources()
    })
    .catch(err => console.log(err))
}

function filterTable() {
    const search = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : ""
    const cat = document.getElementById('categoryFilter') ? document.getElementById('categoryFilter').value.toLowerCase() : ""
    const stock = document.getElementById('stockFilter') ? document.getElementById('stockFilter').value.toLowerCase() : ""
    const rows = document.querySelectorAll('#tableBody tr')
    let visible = 0
    rows.forEach(row => {
        const text = row.textContent.toLowerCase()
        if ((!search || text.includes(search)) && (!cat || text.includes(cat)) && (!stock || text.includes(stock))) {
            row.style.display = ''; visible++
        } else {
            row.style.display = 'none'
        }
    })
    if (document.getElementById('rowCount'))
        document.getElementById('rowCount').textContent = 'Showing ' + visible + ' records'
}

function clearFilters() {
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = ''
    if (document.getElementById('categoryFilter')) document.getElementById('categoryFilter').value = ''
    if (document.getElementById('stockFilter')) document.getElementById('stockFilter').value = ''
    filterTable()
}

// ─── ADD PAGE ───

function handleSubmit(event) {
    event.preventDefault()

    const data = {
        name: document.getElementById("name").value,          // ✅ "name"
        category: document.getElementById("category").value,
        unit: document.getElementById("unit").value,
        stock: parseInt(document.getElementById("stock").value),      // ✅ "stock"
        allocated: parseInt(document.getElementById("allocated").value) || 0,
        facility: document.getElementById("facility").value,
        status: document.getElementById("status").value,
    }

    console.log("data:", data)

    fetch("/submitresource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        window.location.href = "/resources"
    })
    .catch(err => console.log(err))
}

// ─── EDIT PAGE ───

function update(event) {
    event.preventDefault()
    if (!document.getElementById("resourceName")) return

    const id = window.location.pathname.split("/").pop()

    const data = {
        name: document.getElementById("resourceName").value,
        category: document.getElementById("category").value,
        unit: document.getElementById("unit").value,
        stock: parseInt(document.getElementById("quantity").value),
        allocated: parseInt(document.getElementById("allocated").value) || 0,
        facility: document.getElementById("facility").value,
        status: document.getElementById("status").value,
    }

    fetch(`/updateresource/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        window.location.href = "/resources"
    })
    .catch(err => console.log(err))
}

window.onload = loadResources
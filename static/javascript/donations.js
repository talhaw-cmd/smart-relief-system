function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); document.getElementById('overlay').classList.toggle('show'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); }
function logout() { window.location.href = "/logout" }

// ─── LIST PAGE ───

function loadDonations() {
    const tbody = document.getElementById("tableBody")
    if (!tbody) return

    fetch("/donationdata")
    .then(res => res.json())
    .then(data => {
        tbody.innerHTML = ""
        document.getElementById("rowCount").textContent = "Showing " + data.length + " records"
        data.forEach(i => {
            const amountDisplay = i.donation_type === "monetary"
                ? `<strong>PKR ${i.amount}</strong>`
                : i.description

            tbody.innerHTML += `
                <tr>
                    <td><strong>${i.donor_name}</strong>
                        <div class="text-muted text-sm">${i.donor_type}</div>
                    </td>
                    <td><span class="badge badge-success">${i.donation_type}</span></td>
                    <td>${amountDisplay}</td>
                    <td>${i.designated_for}</td>
                    <td>${i.received_by}</td>
                    <td>${i.date_received}</td>
                    <td><span class="badge badge-success">${i.status}</span></td>
                    <td class="table-actions">
                        <button onclick="deletedonation('${i.id}')" class="btn btn-danger btn-sm">🗑</button>
                    </td>
                </tr>
            `
        })
    })
    .catch(err => console.log(err))
}

function deletedonation(id) {
    if (!confirm("Delete this donation record?")) return
    fetch(`/deletedonation/${id}`)
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        loadDonations()
    })
}

function filterTable() {
    const search = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : ""
    const type = document.getElementById('typeFilter') ? document.getElementById('typeFilter').value.toLowerCase() : ""
    const status = document.getElementById('statusFilter') ? document.getElementById('statusFilter').value.toLowerCase() : ""
    const rows = document.querySelectorAll('#tableBody tr')
    let visible = 0
    rows.forEach(row => {
        const text = row.textContent.toLowerCase()
        if ((!search || text.includes(search)) && (!type || text.includes(type)) && (!status || text.includes(status))) {
            row.style.display = ''; visible++
        } else { row.style.display = 'none' }
    })
    if (document.getElementById('rowCount'))
        document.getElementById('rowCount').textContent = 'Showing ' + visible + ' records'
}

function clearFilters() {
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = ''
    if (document.getElementById('typeFilter')) document.getElementById('typeFilter').value = ''
    if (document.getElementById('statusFilter')) document.getElementById('statusFilter').value = ''
    if (document.getElementById('dateFilter')) document.getElementById('dateFilter').value = ''
    filterTable()
}

// ─── ADD PAGE ───

function toggleDonationFields() {
    const type = document.getElementById('donationType')
    if (!type) return
    const val = type.value
    const isMonetary = val === 'monetary'
    const isInKind = ['inkind','food','medical','clothing','equipment','other'].includes(val)
    document.getElementById('monetaryFields').style.display = isMonetary ? 'block' : 'none'
    document.getElementById('inkindFields').style.display = isInKind ? 'block' : 'none'
}

function submitdonation(event) {
    event.preventDefault()
    if (!document.getElementById("donorName")) return

    const donationType = document.getElementById("donationType").value
    const isMonetary = donationType === "monetary"

    const data = {
        donor_name: document.getElementById("donorName").value,
        donor_type: document.getElementById("donorType").value,
        contact_person: document.getElementById("contactPerson").value,
        contact_number: document.getElementById("contactNumber").value,
        email: document.getElementById("donorEmail").value,
        donation_type: donationType,
        amount: isMonetary ? parseFloat(document.getElementById("amount").value) : 0,
        description: !isMonetary ? document.getElementById("itemDescription").value : "",
        designated_for: document.getElementById("designatedFor").value,
        received_by: document.getElementById("receivedBy").value,
        date_received: document.getElementById("dateReceived").value,
        status: document.getElementById("donationStatus").value,
        notes: document.getElementById("notes").value,
    }

    fetch("/submitdonation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        window.location.href = "/donations"
    })
    .catch(err => console.log(err))
}

// Receipt toggle
function initReceiptToggle() {
    const el = document.getElementById('sendReceipt')
    if (!el) return
    el.addEventListener('change', function () {
        document.getElementById('receiptEmailGroup').style.display = this.checked ? 'block' : 'none'
    })
}

window.onload = function () {
    loadDonations()
    initReceiptToggle()
}
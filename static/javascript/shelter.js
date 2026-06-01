function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); document.getElementById('overlay').classList.toggle('show'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('show'); }
function deleteRow(btn) { if (confirm('Delete this shelter record?')) { btn.closest('tr').remove(); } }
function filterTable() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value.toLowerCase();
    const rows = document.querySelectorAll('#tableBody tr');
    let visible = 0;
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if ((!search || text.includes(search)) && (!status || text.includes(status))) { row.style.display = ''; visible++; } else { row.style.display = 'none'; }
    });
    document.getElementById('rowCount').textContent = 'Showing ' + visible + ' records';
}
function clearFilters() { document.getElementById('searchInput').value = ''; document.getElementById('statusFilter').value = ''; filterTable(); }






let id = window.location.pathname.split("/").pop()
let shelterName = document.getElementById("shelterName")
let facilityType = document.getElementById("facilityType")
let capacity = document.getElementById("capacity")
let occupants = document.getElementById("occupants")
let status = document.getElementById("status")
let managerName = document.getElementById("managerName")
let district = document.getElementById("district")

function update(event) {
    event.preventDefault()

    const updateddata = {
        shelter_name: shelterName.value,
        type: facilityType.value,
        capacity: capacity.value,
        occupants: occupants.value,
        status: status.value,
        manager: managerName.value,
        location: district.value
    }

    fetch(`/updateshelter/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateddata)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message)
        window.location.href = "/shelters"
    })
}

function logout() {
    window.location.href = "/logout"
}


function handlesbumit(event){
    event.preventDefault()
        const adddata = {
        shelter_name: document.getElementById("shelterName").value,
        type: document.getElementById("facilityType").value,
        capacity: document.getElementById("capacity").value,
        occupants: document.getElementById("occupants") ? document.getElementById("occupants").value : 0,
        status: document.getElementById("status").value,
        manager: document.getElementById("managerName").value,
        location: document.getElementById("district").value
    }
    fetch("/addshelter",
        {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adddata)
        }
    )
    .then(res=>res.json())
    .then(data=>{
        alert(data.message)
    })
}
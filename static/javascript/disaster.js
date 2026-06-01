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
// 🚨 DISASTER FORM SUBSCRIPTION (ADD)
// ==========================================
function submitdisaster(event) {
    event.preventDefault();
    
    // Elements read precisely inside execution frame
    const inputTitle = document.getElementById("title");
    const inputType = document.getElementById("type");
    const inputStatus = document.getElementById("status");
    const inputLocation = document.getElementById("loc");
    const inputStartedAt = document.getElementById("started_at");
    const inputSeverity = document.getElementById("severity");

    const disasterData = { 
        title: inputTitle.value,
        type: inputType.value,
        location: inputLocation.value,
        severity: inputSeverity.value,
        status: inputStatus.value,
        started_at: inputStartedAt.value,
    };

    fetch("/submitdisaster", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(disasterData)
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            console.log(data);
            alert(data.message);
            // Dynamic alert animation feedback trigger
            const successAlert = document.getElementById('successMsg');
            if (successAlert) {
                successAlert.style.display = 'flex';
                window.scrollTo(0, 0);
                setTimeout(() => { window.location.href = '/disaster'; }, 1500);
            }
        }
    })
    .catch(err => console.log(err));
}

// ==========================================
// 🔄 DISASTER RECORD LIFECYCLE (UPDATE)
// ==========================================
const disasterId = window.location.pathname.split("/").pop();

function updatedisaster(event) {
    event.preventDefault();
    
    const updatedData = {
        title: document.getElementById("title").value,
        type: document.getElementById("type").value,
        location: document.getElementById("loc").value,
        severity: document.getElementById("severity").value,
        status: document.getElementById("status").value,
        started_at: document.getElementById("started_at").value,
    };

    fetch(`/updatedisaster/${disasterId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        window.location.href = "/disaster";
    })
    .catch(err => console.log(err));
}


function filterTable() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const typeValue = document.getElementById("typeFilter").value.toLowerCase();
    const statusValue = document.getElementById("statusFilter").value.toLowerCase();

    const rows = document.querySelectorAll("#tableBody tr");

    let visibleRows = 0;

    rows.forEach(row => {
        const title = row.cells[0].textContent.toLowerCase();
        const type = row.cells[1].textContent.toLowerCase();
        const location = row.cells[2].textContent.toLowerCase();
        const status = row.cells[4].textContent.toLowerCase();

        const searchMatch =
            title.includes(searchValue) ||
            location.includes(searchValue);

        const typeMatch =
            typeValue === "" || type === typeValue;

        const statusMatch =
            statusValue === "" || status === statusValue;

        if (searchMatch && typeMatch && statusMatch) {
            row.style.display = "";
            visibleRows++;
        } else {
            row.style.display = "none";
        }
    });

    document.getElementById("rowCount").textContent =
        `${visibleRows} record(s) found`;

    document.getElementById("paginationInfo").textContent =
        `Showing ${visibleRows} record(s)`;
}

function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("typeFilter").value = "";
    document.getElementById("statusFilter").value = "";

    filterTable();
}
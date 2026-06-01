document.addEventListener("DOMContentLoaded", function () {
    // Date already Flask se aa rahi hai — JS ki zaroorat nahi

    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('overlay').classList.toggle('show');
    }

    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    }

    window.toggleSidebar = toggleSidebar;
    window.closeSidebar = closeSidebar;
    window.logout = function () {
        window.location.href = '/logout';
    };
});
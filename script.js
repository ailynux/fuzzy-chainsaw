// Toggle sidebar collapse
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("collapsed");
}

// Toggle between dark and light mode
function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-mode"); // Only toggle dark mode
}

// Set initial theme based on preference
window.onload = function () {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
    }
};

// Sidebar collapse logic
document.getElementById('collapse-btn').addEventListener('click', function () {
    toggleSidebar();
});

// Theme toggle button logic
document.getElementById('theme-toggle-btn').addEventListener('click', function () {
    toggleTheme();
});

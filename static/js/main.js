function toggleNav() {
  const d = document.getElementById("mobDrawer");
  d.classList.toggle("open");
}
function closeNav() {
  document.getElementById("mobDrawer").classList.remove("open");
}
document.addEventListener("click", function(e) {
  const d = document.getElementById("mobDrawer");
  const h = document.querySelector(".topnav-ham");
  if (d && h && !d.contains(e.target) && !h.contains(e.target)) {
    d.classList.remove("open");
  }
});
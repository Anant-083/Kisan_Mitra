function toggleNav() {
  const m = document.getElementById("mobDrawer");
  m.classList.toggle("open");
}
function closeNav() {
  document.getElementById("mobDrawer").classList.remove("open");
}
// close drawer on outside click
document.addEventListener("click", function(e) {
  const drawer = document.getElementById("mobDrawer");
  const ham = document.querySelector(".topnav-ham");
  if (drawer && ham && !drawer.contains(e.target) && !ham.contains(e.target)) {
    drawer.classList.remove("open");
  }
});
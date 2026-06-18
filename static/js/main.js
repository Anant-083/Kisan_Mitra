function toggleNav(){document.getElementById('drawer').classList.toggle('open')}
function closeNav(){document.getElementById('drawer').classList.remove('open')}
document.addEventListener('click',function(e){
  const d=document.getElementById('drawer');
  const h=document.querySelector('.nav-ham');
  if(d&&h&&!d.contains(e.target)&&!h.contains(e.target)){d.classList.remove('open')}
});

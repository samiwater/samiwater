// باز کردن منو
function showMenu() {
  document.getElementById('menu-overlay').style.display = 'block';
}

// بستن منو
function hideMenu() {
  document.getElementById('menu-overlay').style.display = 'none';
}

// هدایت به صفحات داخلی
function navigate(url) {
  if (url !== '#') {
    window.location.href = url;
  }
}

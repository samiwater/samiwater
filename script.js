// باز کردن منو
function showMenu() {
  const menu = document.getElementById('menu-overlay');
  if (menu) {
    menu.style.display = 'block';
  }
}

// بستن منو
function hideMenu() {
  const menu = document.getElementById('menu-overlay');
  if (menu) {
    menu.style.display = 'none';
  }
}

// هدایت هوشمند (جلوگیری از خطای 404 در پنل و هدایت درست صفحات)
function navigate(url) {
  if (!url || url === '#') return;

  // حذف اسلش اول برای بررسی آیدی در صفحه فعلی (مثلا /users تبدیل به users میشه)
  const cleanId = url.replace(/^\//, '');
  const targetSection = document.getElementById(cleanId) || document.getElementById(`${cleanId}-section`);

  // ۱. اگر بخش مورد نظر داخل همین صفحه بود، بدون رفرش نمایشش بده
  if (targetSection) {
    document.querySelectorAll('.panel-section').forEach(sec => {
      sec.style.display = 'none';
      sec.classList.remove('active');
    });
    targetSection.style.display = 'block';
    targetSection.classList.add('active');
    hideMenu();
    return;
  }

  // ۲. اگر لینک مربوط به صفحات قدیمی پنل بود که باعث ارور 404 میشد، بفرستش به پنل ادمین
  const adminRoutes = ['dash', 'users', 'requests', 'services-bank', 'catalog'];
  if (adminRoutes.includes(cleanId)) {
    window.location.href = 'admin.html';
    return;
  }

  // ۳. اگر اسم فایل با .html نداشت و آدرس خارجی نبود، پسوند .html بهش بده
  if (!url.endsWith('.html') && !url.startsWith('http')) {
    window.location.href = cleanId + '.html';
  } else {
    window.location.href = url;
  }
}

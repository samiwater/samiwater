// بررسی شماره تلفن برای ورود سریع (اختیاری) function checkPhone() { const phone = document.getElementById('phone')?.value; const knownNumbers = ['09121234567', '09351234567']; // شماره‌های مجاز

if (knownNumbers.includes(phone)) { document.getElementById('step1').style.display = 'none'; document.getElementById('stepQuick').style.display = 'block'; } else { document.getElementById('step1').style.display = 'none'; document.getElementById('step2').style.display = 'block'; } }

// باز و بسته‌کردن منوی همبرگری function toggleMenu() { const menu = document.getElementById('sideMenu'); if (menu.style.right === '0px') { menu.style.right = '-280px'; } else { menu.style.right = '0px'; } }

// مسیر‌یابی داخلی اپ از داخل منو function navigate(url) { window.location.href = url; }


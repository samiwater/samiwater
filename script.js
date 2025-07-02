
function checkPhone() {
  const phone = document.getElementById('phone').value;
  const knownNumbers = ['09121234567', '09351234567']; // شبیه‌سازی بانک شماره

  if (knownNumbers.includes(phone)) {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('stepQuick').style.display = 'block';
  } else {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
  }
}

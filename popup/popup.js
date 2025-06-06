// popup.js

// 쿠키 설정 함수
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
  }
  
  // 쿠키 가져오기 함수
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === decodeURIComponent(name)) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  
  // 팝업 닫기 함수
  function closePopup() {
    const checkbox = document.getElementById("check_popup");
    if (checkbox && checkbox.checked) {
      setCookie("popupYN", "N", 1); // 하루 동안 안 뜨게 설정
      console.log("✅ 쿠키 popupYN=N 설정됨");
    }
    window.close();
  }
  
  // 시계 + 카운트다운
  document.addEventListener("DOMContentLoaded", function () {
    let remainingSeconds = 50;
    const timerDiv = document.getElementById("Time");
    const clockDiv = document.getElementById("clock");
  
    function showClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });
      clockDiv.innerText = `현재 시간: ${timeStr}`;
    }
  
    function showCountdown() {
      timerDiv.innerText = `${remainingSeconds}초 후 창이 닫힙니다.`;
      remainingSeconds--;
      if (remainingSeconds >= 0) {
        setTimeout(showCountdown, 1000);
      } else {
        closePopup(); // 자동 닫힘
      }
    }
  
    showClock();
    setInterval(showClock, 1000);
    showCountdown();
  });
  
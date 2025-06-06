import { verifyJWT } from './jwt_token.js';
import { decryptText } from './crypto2.js';

window.onload = function () {
  const token = localStorage.getItem("jwt_token");
  const session = sessionStorage.getItem("Session_Storage_test");

  if ((!token || !session) && !getPopupCookie()) {
    window.open("/popup/popup.html", "popupWindow", "width=400,height=300");
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById("login_btn");
  const logoutBtn = document.getElementById("logout_btn");

  if (loginBtn) {
    loginBtn.style.display = "inline-block";
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isAuthenticated()) {
        alert("이미 로그인되어 있습니다.");
      } else {
        window.location.href = "/login/login.html";
      }
    });
  }

  if (logoutBtn) {
    if (isAuthenticated()) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.addEventListener("click", () => {
        // 로그아웃은 logout.html에서 처리하므로 이동만
        window.location.href = "/login/logout.html";
      });
    } else {
      logoutBtn.style.display = "none";
    }
  }

  init_logined();
});

function isAuthenticated() {
  const token = localStorage.getItem("jwt_token");
  const session = sessionStorage.getItem("Session_Storage_test");
  if (!token || !session) return false;

  try {
    const payload = verifyJWT(token);
    const payloadEmail = payload.email || payload.sub || payload.user || null;
    return payloadEmail && payloadEmail.trim() === session.trim();
  } catch (err) {
    console.warn("JWT 검증 실패:", err);
    return false;
  }
}

function init_logined() {
  const email = sessionStorage.getItem("Session_Storage_test");
  const emailEl = document.getElementById("user_email");
  const profileBtn = document.getElementById("profile_btn");

  if (email && emailEl) {
    emailEl.innerText = `현재 로그인 계정: ${email}`;
  }

  if (profileBtn) {
    if (email) {
      profileBtn.style.display = "inline-block";  // 로그인 상태면 버튼 보이기
    } else {
      profileBtn.style.display = "none";          // 비로그인 시 숨기기
    }
  }
}

function getPopupCookie() {
  const name = "popupHidden=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

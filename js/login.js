import { verifyJWT, generateJWT } from './jwt_token.js';
import { generateKey, encryptText, decryptText } from './crypto2.js';

// ✅ 로그인 버튼 클릭 시 실행
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login_btn');
  const logoutBtn = document.getElementById('logout_btn');

  if (loginBtn) {
    loginBtn.style.display = "inline-block";
    loginBtn.addEventListener('click', async () => {
      if (isAuthenticated()) {
        alert("이미 로그인되어 있습니다.");
        return;
      }
      login_count();
      await check_input();
    });
  }

  if (logoutBtn) {
    if (isAuthenticated()) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.addEventListener('click', () => {
        sessionStorage.clear();
        localStorage.removeItem("jwt_token");
        alert("로그아웃 되었습니다.");
        window.location.href = "/login/login.html";
      });
    } else {
      logoutBtn.style.display = "none";
    }
  }

  init();
});

// ✅ 로그인 시 입력 검사 + 유효성 검사 추가
async function check_input() {
  const email = document.getElementById("typeEmailX").value;
  const pw = document.getElementById("typePasswordX").value;

  if (!email || !pw) {
    alert("아이디와 비밀번호를 모두 입력하세요.");
    return;
  }

  // ✅ 이메일/비밀번호 유효성 검사 추가
  if (email.length < 5) {
    alert("이메일은 5자 이상이어야 합니다.");
    return;
  }

  if (pw.length < 8) {
    alert("비밀번호는 8자 이상이어야 합니다.");
    return;
  }

  if (/\d{3,}/.test(pw)) {
    alert("비밀번호에 숫자가 3자리 이상 연속으로 포함될 수 없습니다.");
    return;
  }

  if (/([a-zA-Z0-9])\1\1/.test(pw)) {
    alert("같은 문자를 3번 이상 반복할 수 없습니다.");
    return;
  }

  if (!/[!@#$%^&*]/.test(pw)) {
    alert("비밀번호에는 특수문자가 1개 이상 포함되어야 합니다.");
    return;
  }

  const cleanEmail = check_xss(email);
  const cleanPw = check_xss(pw);
  if (!cleanEmail || !cleanPw) return;

  if (document.getElementById("idSaveCheck").checked) {
    setCookie("id", cleanEmail, 1);
  } else {
    deleteCookie("id");
  }

  const key = await generateKey();
  const encrypted = await encryptText(key, cleanPw);

  sessionStorage.setItem("Session_Storage_test", cleanEmail);

  const currentTime = Math.floor(Date.now() / 1000);
  const payload = {
    email: cleanEmail,
    exp: currentTime + 3600
  };
  localStorage.setItem("jwt_token", generateJWT(payload));

  alert("로그인 성공!");
  window.location.href = "/login/index_login.html";
}

// ✅ 초기화 함수
function init() {
  const emailInput = document.getElementById("typeEmailX");
  const idSaveCheck = document.getElementById("idSaveCheck");
  const savedId = getCookie("id");

  if (savedId) {
    emailInput.value = decodeURIComponent(savedId);
    idSaveCheck.checked = true;
  }

  session_check();
}

// ✅ 세션 유지 확인
function session_check() {
  const session_id = sessionStorage.getItem("Session_Storage_test");
  const user_email = document.getElementById("user_email");
  const user_time = document.getElementById("user_time");

  if (session_id && user_email && user_time) {
    user_email.innerHTML = session_id + "님 환영합니다!";
    user_time.innerHTML = "현재 시각: " + new Date().toLocaleString();
  }
}

// ✅ 쿠키 설정 함수
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

// ✅ 쿠키 가져오기 함수
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return "";
}

// ✅ 쿠키 삭제 함수
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ✅ 간단한 XSS 필터링
function check_xss(input) {
  const sanitized = DOMPurify.sanitize(input);
  if (sanitized !== input) {
    alert("XSS 공격 가능성이 있는 입력입니다.");
    return false;
  }
  return sanitized;
}

// ✅ 로그인 상태 확인 함수
function isAuthenticated() {
  const token = localStorage.getItem("jwt_token");
  const session = sessionStorage.getItem("Session_Storage_test");
  try {
    const payload = verifyJWT(token);
    return token && session && payload;
  } catch (err) {
    return false;
  }
}

// ✅ 로그인 시도 횟수 제한
let loginAttempts = 0;
function login_count() {
  loginAttempts++;
  if (loginAttempts >= 3) {
    alert("로그인 3회 실패. 잠시 후 다시 시도해주세요.");
  }
}

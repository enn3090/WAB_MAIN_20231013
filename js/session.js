// session.js

// 세션에 이메일 저장
export function session_set() {
    let session_id = document.querySelector("#typeEmailX");
    if (session_id && sessionStorage) {
      sessionStorage.setItem("Session_Storage_test", session_id.value);
    } else {
      alert("입력 요소 또는 스토리지를 사용할 수 없습니다.");
    }
  }
  
  // 세션에서 이메일 불러오기
  export function session_get() {
    if (sessionStorage) {
      return sessionStorage.getItem("Session_Storage_test");
    } else {
      alert("세션 스토리지 지원 x");
      return null;
    }
  }
  
  // 세션 유무 검사
  export function session_check() {
    if (sessionStorage.getItem("Session_Storage_test")) {
      alert("이미 로그인 되었습니다.");
      location.href = "../login/index_login.html"; // 로그인 완료 페이지로 이동
    }
  }
  
  // 회원가입 정보 객체를 세션에 저장하는 함수
  export function session_set2(user) {
    if (sessionStorage) {
      sessionStorage.setItem("signup_user", JSON.stringify(user.getUserInfo()));
    } else {
      alert("세션 스토리지를 지원하지 않는 브라우저입니다.");
    }
  }
  
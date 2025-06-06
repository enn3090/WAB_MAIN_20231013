const nameRegex = /^[가-힣]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

class SignUp {
  constructor(name, email, password, re_password) {
    this._name = name;
    this._email = email;
    this._password = password;
    this._re_password = re_password;
  }

  setUserInfo(name, email, password, re_password) {
    this._name = name;
    this._email = email;
    this._password = password;
    this._re_password = re_password;
  }

  getUserInfo() {
    return {
      name: this._name,
      email: this._email,
      password: this._password,
      re_password: this._re_password,
    };
  }

  validateName() {
    return nameRegex.test(this._name.trim());
  }

  validateEmail() {
    return emailRegex.test(this._email.trim());
  }

  validatePassword() {
    return pwRegex.test(this._password);
  }

  passwordsMatch() {
    return this._password === this._re_password;
  }
}

// 암호화 함수
function encryptData(plainText, secretKey) {
  return CryptoJS.AES.encrypt(plainText, secretKey).toString();
}

// 복호화 함수
function decryptData(encryptedText, secretKey) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error("복호화 실패:", error);
    return null;
  }
}

// 암호화된 회원가입 정보를 세션에 저장
function saveEncryptedUser(userObj, secretKey) {
  const jsonStr = JSON.stringify(userObj);
  const encryptedStr = encryptData(jsonStr, secretKey);
  sessionStorage.setItem("signup_user_enc", encryptedStr);
}

// 로그인 후 암호화된 회원가입 정보를 복호화하여 출력
function showDecryptedUserInfo(secretKey) {
  const encryptedUserStr = sessionStorage.getItem("signup_user_enc");
  if (!encryptedUserStr) {
    console.log("암호화된 회원가입 정보가 없습니다.");
    return;
  }

  const decryptedJson = decryptData(encryptedUserStr, secretKey);

  if (!decryptedJson) {
    console.log("복호화된 데이터가 없습니다.");
    return;
  }

  try {
    const userObj = JSON.parse(decryptedJson);
    console.log("복호화된 회원가입 정보:", userObj);
  } catch (error) {
    console.error("JSON 파싱 실패:", error);
  }
}

function join() {
  const form = document.querySelector("#join_form");
  const nameInput = document.querySelector("#form3Example1c");
  const emailInput = document.querySelector("#form3Example3c");
  const passwordInput = document.querySelector("#form3Example4c");
  const rePasswordInput = document.querySelector("#form3Example4cd");
  const agreeCheckbox = document.querySelector("#form2Example3c");

  if (
    nameInput.value.length === 0 ||
    emailInput.value.length === 0 ||
    passwordInput.value.length === 0 ||
    rePasswordInput.value.length === 0
  ) {
    alert("회원가입 폼에 모든 정보를 입력해주세요.");
    return;
  }

  if (!nameRegex.test(nameInput.value)) {
    alert("이름은 한글만 입력 가능합니다.");
    nameInput.focus();
    return;
  }

  if (!emailRegex.test(emailInput.value)) {
    alert("이메일 형식이 올바르지 않습니다.");
    emailInput.focus();
    return;
  }

  if (!pwRegex.test(passwordInput.value)) {
    alert("비밀번호는 8자 이상이며 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
    passwordInput.focus();
    return;
  }

  if (passwordInput.value !== rePasswordInput.value) {
    alert("비밀번호가 일치하지 않습니다.");
    rePasswordInput.focus();
    return;
  }

  if (!agreeCheckbox.checked) {
    alert("약관에 동의하셔야 가입이 가능합니다.");
    agreeCheckbox.focus();
    return;
  }

  const secretKey = "임시_테스트_키_1234"; // 테스트용 키

  const user = new SignUp(
    nameInput.value,
    emailInput.value,
    passwordInput.value,
    rePasswordInput.value
  );

  saveEncryptedUser(user.getUserInfo(), secretKey);

  form.action = "../index.html";
  form.method = "get";
  form.submit();
}

document.getElementById("join_btn").addEventListener("click", join);

document.addEventListener("DOMContentLoaded", () => {
  const secretKey = "임시_테스트_키_1234";
  showDecryptedUserInfo(secretKey);
});

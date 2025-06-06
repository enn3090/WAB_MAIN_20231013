const cryptoModule = {
    // ✅ AES256 암호화 함수
    encodeByAES256: function (key, data) {
      const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""), // IV는 비워둠
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });
      return cipher.toString(); // 암호문 반환
    },
  
    // ✅ AES256 복호화 함수
    decodeByAES256: function (key, data) {
      const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""), // 암호화와 동일한 IV 사용
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });
      return cipher.toString(CryptoJS.enc.Utf8); // 복호화된 문자열 반환
    },
  
    // ✅ 비밀번호 암호화 함수
    encrypt_text: function (password) {
      const k = "mySecretKey1234567890"; // 대칭키 (로그인과 복호화 모두 동일해야 함)
      const rk = k.padEnd(32, " ");       // AES256은 32바이트 키 필요
      const b = password;
      const eb = this.encodeByAES256(rk, b); // 암호화 실행
      console.log("암호화된 비밀번호:", eb);
      return eb;
    },
  
    // ✅ 비밀번호 복호화 함수
    decrypt_text: function () {
      const k = "mySecretKey1234567890"; // 동일한 키 사용
      const rk = k.padEnd(32, " ");
      const eb = session_get(); // 세션에서 암호문 가져오기
      const b = this.decodeByAES256(rk, eb); // 복호화 실행
      console.log("복호화된 비밀번호:", b);
      return b;
    }
  };
  
// ✅ 전역 비밀키
const JWT_SECRET = "your_secret_key_here";

// ✅ Base64URL 인코딩
function base64UrlEncode(wordArray) {
  return CryptoJS.enc.Base64.stringify(wordArray)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ✅ Base64URL 디코딩
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (str.length % 4)) % 4;
  str += "=".repeat(pad);
  return atob(str);
}

// ✅ JWT 생성 함수 (exp 포함)
function generateJWT(payload) {
  const header = { alg: "HS256", typ: "JWT" };

  const currentTime = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    exp: currentTime + 3600 // 1시간 후 만료
  };

  const encodedHeader = base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify(fullPayload)));

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = CryptoJS.HmacSHA256(data, JWT_SECRET);
  const encodedSignature = base64UrlEncode(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// ✅ JWT 검증 함수
function verifyJWT(token) {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = CryptoJS.HmacSHA256(dataToSign, JWT_SECRET);
    const expectedEncodedSignature = base64UrlEncode(expectedSignature);

    if (expectedEncodedSignature !== encodedSignature) {
      console.warn("JWT 서명 불일치");
      return null;
    }

    const decodedPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const currentTime = Math.floor(Date.now() / 1000);

    if (!decodedPayload.exp || decodedPayload.exp < currentTime) {
      console.warn("JWT 만료됨 또는 exp 없음");
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error("JWT 파싱 오류:", error);
    return null;
  }
}

// ✅ 모듈 export
export { generateJWT, verifyJWT, base64UrlEncode, base64UrlDecode };

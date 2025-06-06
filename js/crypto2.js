// ✅ AES-GCM 키 생성
export async function generateKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// ✅ 키 export → base64 문자열로 변환
export async function exportKey(key) {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// ✅ base64 문자열 키 → CryptoKey 복원
export async function importKey(base64) {
  const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
}

// ✅ 텍스트 암호화 (IV 포함 문자열 반환)
export async function encryptText(key, text) {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));  // 12바이트 IV
  const encodedText = enc.encode(text);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedText
  );

  // IV를 hex 문자열로, ciphertext는 base64 문자열로 변환
  const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, "0")).join("");
  const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));

  return ivHex + ":" + cipherBase64;  // 형식: ivHex:cipherBase64
}

// ✅ 텍스트 복호화 (IV 자동 분리 처리)
export async function decryptText(key, data) {
  try {
    const [ivHex, cipherBase64] = data.split(":");
    if (!ivHex || !cipherBase64) throw new Error("암호문 형식 오류");

    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
    const ciphertext = Uint8Array.from(atob(cipherBase64), c => c.charCodeAt(0));

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("❌ 복호화 실패:", e.message);
    return null;
  }
}

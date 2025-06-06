import { verifyJWT } from "./jwt_token.js";

let map;
let marker;
let defaultCenter = new kakao.maps.LatLng(37.566826, 126.9786567);
let markers = [];
let ps = new kakao.maps.services.Places();
let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
let geocoder = new kakao.maps.services.Geocoder();

// ✅ 지도 초기화 및 로그인 검사
window.onload = () => {
  const token = localStorage.getItem("jwt_token");
  let session = sessionStorage.getItem("Session_Storage_test");
  const payload = verifyJWT(token);

  if (!session && payload?.email) {
    sessionStorage.setItem("Session_Storage_test", payload.email);
    session = payload.email;
  }

  if (!token || !session || !payload) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login/login.html";
    return;
  }

  const emailBox = document.getElementById("user_email");
  if (emailBox) {
    emailBox.innerText = `${session}님 환영합니다!`;
  }

  const mapContainer = document.getElementById("map");
  const mapOption = {
    center: defaultCenter,
    level: 3
  };
  map = new kakao.maps.Map(mapContainer, mapOption);

  // ✅ 클릭 위치 마커
  marker = new kakao.maps.Marker({ position: defaultCenter });
  marker.setMap(map);

  kakao.maps.event.addListener(map, "click", function (mouseEvent) {
    const latlng = mouseEvent.latLng;
    marker.setPosition(latlng);

    const message = `클릭한 위치의 위도는 ${latlng.getLat()} 이고, 경도는 ${latlng.getLng()} 입니다`;
    const resultDiv = document.getElementById("clickLatlng");
    if (resultDiv) resultDiv.innerHTML = message;

    // ✅ 주소 표시 추가
    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        const addressBox = document.getElementById("centerAddress");
        if (addressBox) addressBox.innerText = `\u{1F4CD} 주소: ${address}`;
      }
    });
  });
};

// ✅ 지도 조작 함수들
window.moveToGwanghwamun = function () {
  const moveLatLon = new kakao.maps.LatLng(37.5714, 126.9768);
  map.setCenter(moveLatLon);
};

window.zoomIn = function () {
  map.setLevel(map.getLevel() - 1);
};

window.zoomOut = function () {
  map.setLevel(map.getLevel() + 1);
};

window.toggleDrag = function () {
  map.setDraggable(!map.getDraggable());
};

window.toggleZoom = function () {
  map.setZoomable(!map.getZoomable());
};

window.resetMap = function () {
  map.setCenter(defaultCenter);
  map.setLevel(3);
};

// ✅ 장소 검색 함수
window.searchPlaces = function () {
  const inputEl = document.getElementById("search_input");
  if (!inputEl) {
    alert("검색창을 찾을 수 없습니다!");
    return;
  }

  const keyword = inputEl.value?.trim();
  if (!keyword || keyword.length < 1) {
    alert("검색어를 입력해주세요!");
    return;
  }

  ps.keywordSearch(keyword, placesSearchCB);
};

// ✅ 검색 콜백 처리
function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 없습니다.");
  } else {
    alert("검색 중 오류가 발생했습니다.");
  }
}

// ✅ 검색 결과 출력
function displayPlaces(places) {
  const listEl = document.getElementById("placesList");
  listEl.innerHTML = "";
  removeMarkers();

  places.forEach((place, index) => {
    const latlng = new kakao.maps.LatLng(place.y, place.x);
    const marker = new kakao.maps.Marker({ map: map, position: latlng });
    markers.push(marker);

    kakao.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(`<div style="padding:5px;font-size:14px;">${place.place_name}</div>`);
      infowindow.open(map, marker);
    });

    const itemEl = document.createElement("li");
    itemEl.textContent = `${index + 1}. ${place.place_name}`;
    itemEl.style.cursor = "pointer";
    itemEl.onclick = () => {
      map.setCenter(latlng);
      kakao.maps.event.trigger(marker, "click");
    };
    listEl.appendChild(itemEl);
  });
}

// ✅ 기존 마커 제거
function removeMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

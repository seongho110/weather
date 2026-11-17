async function getKoreanAddress(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&accept-language=ko`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const addr = data.address || {};

    const city = addr.city || addr.county || addr.province || '';
    const dong = addr.suburb || addr.quarter || addr.neighbourhood || addr.village || addr.town || '';

    if (city && dong) return `${city} ${dong}`;
    if (dong) return dong;
    if (city) return city;
    return "전주대학교";
  } catch (error) {
    console.warn("한글 주소 변환 실패:", error);
    return "전주대학교 효자동";
  }
}

export function getCurrentLocation() {
  return new Promise((resolve) => {
    // 전주대학교 기준 좌표 (위도 35.8150, 경도 127.0900)
    const defaultLocation = { lat: 35.8150, lng: 127.0900, name: "전주대학교 효자동" };

    if (!navigator.geolocation) {
      resolve(defaultLocation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const name = await getKoreanAddress(lat, lng);
        resolve({ lat, lng, name });
      },
      () => {
        console.warn("위치 권한 거부됨. 전주대학교 기본 위치를 사용합니다.");
        resolve(defaultLocation);
      },
      { timeout: 8000 }
    );
  });
}

export function dfs_xy_conv(code, v1, v2) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let rs = {};
  if (code === "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    let theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs["nx"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["ny"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  }
  return rs;
}
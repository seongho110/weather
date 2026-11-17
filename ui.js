export function renderWeather(items, locationName, isSample = false, nx = 0, ny = 0, baseTime = "") {
  const categoryMap = {};
  if (Array.isArray(items)) {
    // 가장 가까운 예보 시간(fcstTime) 데이터만 추출
    const targetFcstTime = items[0]?.fcstTime;
    items.filter(item => item.fcstTime === targetFcstTime || !item.fcstTime).forEach(item => {
      categoryMap[item.category] = item.obsrValue || item.fcstValue;
    });
  }

  const pty = categoryMap["PTY"] || "0";
  const sky = categoryMap["SKY"] || "1"; // 1: 맑음, 3: 구름많음, 4: 흐림

  let weatherText = "맑음";
  let weatherIcon = "☀️";

  // 비/눈 등 강수 우선 처리, 강수가 없으면(0) 하늘상태(SKY) 기준 적용
  if (pty !== "0") {
    const ptyTextMap = { "1": "비", "2": "비/눈", "3": "눈", "5": "빗방울", "6": "빗방울/눈날림", "7": "눈날림" };
    const ptyIconMap = { "1": "🌧️", "2": "🌨️", "3": "❄️", "5": "🌧️", "6": "🌨️", "7": "❄️" };
    weatherText = ptyTextMap[pty] || "비";
    weatherIcon = ptyIconMap[pty] || "🌧️";
  } else {
    const skyTextMap = { "1": "맑음", "3": "구름많음", "4": "흐림" };
    const skyIconMap = { "1": "☀️", "3": "⛅", "4": "☁️" };
    weatherText = skyTextMap[sky] || "맑음";
    weatherIcon = skyIconMap[sky] || "☀️";
  }

  document.getElementById('location-name').textContent = locationName;
  document.getElementById('temp-value').textContent = categoryMap["T1H"] ?? "--";
  document.getElementById('humidity-value').textContent = `${categoryMap["REH"] ?? "--"} %`;
  document.getElementById('wind-value').textContent = `${categoryMap["WSD"] ?? "--"} m/s`;
  
  const rainVal = categoryMap["RN1"] || "0";
  document.getElementById('rain-value').textContent = (rainVal === "강수없음" || rainVal === "0") ? "0 mm" : rainVal;
  
  document.getElementById('weather-icon').textContent = weatherIcon;
  document.getElementById('weather-desc').textContent = weatherText;
  document.getElementById('grid-coord').textContent = `nx: ${nx}, ny: ${ny}`;
  document.getElementById('base-datetime').textContent = baseTime ? `${baseTime.slice(0, 2)}:00` : "--:--";

  const banner = document.getElementById('status-banner');
  if (isSample) {
    banner.classList.remove('hidden');
    banner.innerHTML = "⚠️ <b>안내:</b> API 키 미설정 또는 CORS 문제로 <b>샘플 데이터</b>를 표시 중입니다. <code>config.js</code>에 올바른 인증키를 넣어주세요.";
  } else {
    banner.classList.add('hidden');
  }
}
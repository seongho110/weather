export function renderWeather(items, locationName, isSample = false, nx = 0, ny = 0, baseTime = "") {
  const categoryMap = {};
  if (Array.isArray(items)) {
    items.forEach(item => { categoryMap[item.category] = item.obsrValue; });
  }

  const pty = categoryMap["PTY"] || "0";
  const ptyTextMap = { "0": "맑음", "1": "비", "2": "비/눈", "3": "눈", "5": "빗방울", "6": "빗방울눈날림", "7": "눈날림" };
  const iconMap = { "0": "☀️", "1": "🌧️", "2": "🌨️", "3": "❄️", "5": "🌧️", "6": "🌨️", "7": "❄️" };

  document.getElementById('location-name').textContent = locationName;
  document.getElementById('temp-value').textContent = categoryMap["T1H"] ?? "--";
  document.getElementById('humidity-value').textContent = `${categoryMap["REH"] ?? "--"} %`;
  document.getElementById('wind-value').textContent = `${categoryMap["WSD"] ?? "--"} m/s`;
  document.getElementById('rain-value').textContent = `${categoryMap["RN1"] ?? "0"} mm`;
  document.getElementById('weather-icon').textContent = iconMap[pty] || "☀️";
  document.getElementById('weather-desc').textContent = ptyTextMap[pty] || "맑음";
  document.getElementById('grid-coord').textContent = `nx: ${nx}, ny: ${ny}`;
  document.getElementById('base-datetime').textContent = baseTime ? `${baseTime.slice(0, 2)}:00` : "--:--";

  const banner = document.getElementById('status-banner');
  if (isSample) {
    banner.classList.remove('hidden');
    banner.innerHTML = "⚠️ <b>안내:</b> API 키 미설정 또는 CORS 문제로 <b>샘플 데이터</b>를 표시 중입니다. <code>js/config.js</code>에 올바른 인증키를 넣어주세요.";
  } else {
    banner.classList.add('hidden');
  }
}
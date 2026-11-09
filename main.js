import { getCurrentLocation, dfs_xy_conv } from './location.js';
import { getBaseDateTime } from './timeUtils.js';
import { fetchWeatherData, getMockData } from './weatherApi.js';
import { renderWeather } from './ui.js';

async function updateApp() {
  const { lat, lng, name } = await getCurrentLocation();
  const grid = dfs_xy_conv("toXY", lat, lng);
  const { base_date, base_time } = getBaseDateTime();

  try {
    const weatherData = await fetchWeatherData({
      base_date,
      base_time,
      nx: grid.nx,
      ny: grid.ny
    });
    renderWeather(weatherData, name, false, grid.nx, grid.ny, base_time);
  } catch (error) {
    console.warn("API 호출 실패, 샘플 데이터를 사용합니다:", error.message);
    renderWeather(getMockData(), `${name} (샘플)`, true, grid.nx, grid.ny, base_time);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateApp();
  document.getElementById('refresh-btn').addEventListener('click', updateApp);
});
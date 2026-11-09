import { SERVICE_KEY } from './config.js';

export async function fetchWeatherData({ base_date, base_time, nx, ny }) {
  if (!SERVICE_KEY || SERVICE_KEY.includes('여기에_발급받은_인증키')) {
    throw new Error('KEY_NOT_CONFIGURED');
  }

  const endpoint = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: "100",
    dataType: "JSON",
    base_date,
    base_time,
    nx,
    ny
  });

  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (!response.ok) throw new Error(`HTTP Error status: ${response.status}`);

  const data = await response.json();
  if (data.response?.header?.resultCode !== "00") {
    throw new Error(data.response?.header?.resultMsg || "API Call Failed");
  }

  return data.response.body.items.item;
}

export function getMockData() {
  return [
    { category: "T1H", obsrValue: "18.5" },
    { category: "REH", obsrValue: "55" },
    { category: "WSD", obsrValue: "2.4" },
    { category: "RN1", obsrValue: "0" },
    { category: "PTY", obsrValue: "0" }
  ];
}
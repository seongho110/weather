import { SERVICE_KEY } from './config.js';

export async function fetchWeatherData({ base_date, base_time, nx, ny }) {
  if (!SERVICE_KEY || SERVICE_KEY.includes('여기에_발급받은_인증키')) {
    throw new Error('KEY_NOT_CONFIGURED');
  }

  // 초단기예보 API (하늘상태 SKY 포함)
  const endpoint = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
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
    { category: "T1H", fcstValue: "8.2" },
    { category: "REH", fcstValue: "55" },
    { category: "WSD", fcstValue: "2.4" },
    { category: "RN1", fcstValue: "강수없음" },
    { category: "PTY", fcstValue: "0" },
    { category: "SKY", fcstValue: "4" } // 샘플: 흐림
  ];
}
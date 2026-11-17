export function getBaseDateTime() {
  const now = new Date();

  // 45분 이전이면 1시간 전 30분 데이터 사용
  if (now.getMinutes() < 45) {
    now.setHours(now.getHours() - 1);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');

  return {
    base_date: `${year}${month}${day}`,
    base_time: `${hours}30`
  };
}
export function getBaseDateTime() {
  const now = new Date();

  // 40분 미만이면 이전 1시간 전 40분 데이터 사용
  if (now.getMinutes() < 40) {
    now.setHours(now.getHours() - 1);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');

  return {
    base_date: `${year}${month}${day}`,
    base_time: `${hours}00`
  };
}
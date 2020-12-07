const getNumberOfWeek = () => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getTimestamp = () => {
  const t = new Date();
  const date = `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
  const time = ` ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
  return date + time;
};

export { getNumberOfWeek, getTimestamp };

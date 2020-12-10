import { executeQuery } from "../database/database.js";

const stripObj = obj => {
  const newObj = {};
  for (let key in obj) {
    if (obj[key] !== null) newObj[key] = obj[key];
  }
  if (Object.keys(newObj).length === 0) return { status: 404 };
  else return newObj;
};

const getSummary = async () => {
  const res = await executeQuery(`SELECT ROUND(AVG(slp_dur), 1) slp_dur, ROUND(AVG(slp_qlty), 1) slp_qlty,
  ROUND(AVG(time_sport), 1) time_sport, ROUND(AVG(time_study), 1) time_study,
  ROUND(AVG(eating), 1) eating,
  ROUND(AVG((SELECT AVG(c) FROM (VALUES(m.mood), (e.mood)) T (c))), 1) mood
  FROM
    (SELECT * FROM evening_reports WHERE date > CURRENT_DATE - interval '7 days') e
  FULL OUTER JOIN
    (SELECT * FROM morning_reports WHERE date > CURRENT_DATE - interval '7 days') m
  ON e.date = m.date;`);
  if (res && res.rowCount > 0) {
    return stripObj(res.rowsOfObjects()[0]);
  } else return { status: 404 };
};

const avgResults = async (year, month, day) => {
  const res = await executeQuery(
    `SELECT ROUND(AVG(slp_dur), 1) slp_dur, ROUND(AVG(slp_qlty), 1) slp_qlty,
  ROUND(AVG(time_sport), 1) time_sport, ROUND(AVG(time_study), 1) time_study,
  ROUND(AVG(eating), 1) eating,
  ROUND(AVG((SELECT AVG(c) FROM (VALUES(m.mood), (e.mood)) T (c))), 1) mood
  FROM
    (SELECT * FROM evening_reports WHERE EXTRACT(YEAR FROM date) = $1
    AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(DAY FROM date) = $3 ) e
  FULL OUTER JOIN
    (SELECT * FROM morning_reports WHERE EXTRACT(YEAR FROM date) = $1
    AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(DAY FROM date) = $3 ) m
  ON e.date = m.date;`,
    year,
    month,
    day
  );
  if (res && res.rowCount > 0) {
    return stripObj(res.rowsOfObjects()[0]);
  } else return { status: 404 };
};

export { getSummary, avgResults };

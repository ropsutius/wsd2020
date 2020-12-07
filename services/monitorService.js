import { executeQuery } from "../database/database.js";

const reportExists = async (date, email, type) => {
  const res = await executeQuery(
    `SELECT EXISTS(SELECT 1 FROM ${type} WHERE date = $1 AND email = $2)`,
    date,
    email
  );
  return res.rowsOfObjects()[0].exists;
};

const deleteReport = async (date, email, type) => {
  await executeQuery(
    `DELETE FROM ${type} WHERE date = $1 AND email = $2`,
    date,
    email
  );
};

const addMorning = async (date, slp_dur, slp_qlty, mood, email) => {
  if (reportExists(date, email, "morning_reports"))
    deleteReport(date, email, "morning_reports");

  await executeQuery(
    `INSERT INTO morning_reports (date, slp_dur, slp_qlty, mood, email)
    VALUES ($1, $2, $3, $4, $5)`,
    date,
    slp_dur,
    slp_qlty,
    mood,
    email
  );
};

const addEvening = async (date, sprt_t, std_t, eating, mood, email) => {
  if (reportExists(date, email, "evening_reports"))
    deleteReport(date, email, "evening_reports");

  await executeQuery(
    `INSERT INTO evening_reports (date, time_sport, time_study, eating, mood, email)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    date,
    sprt_t,
    std_t,
    eating,
    mood,
    email
  );
};

const avgMoodByDay = async (email, date) => {
  const res = await executeQuery(
    `SELECT ROUND(AVG((SELECT AVG(c) FROM (VALUES(m.mood), (e.mood)) T (c))), 1) mood
    FROM
      (SELECT * FROM evening_reports WHERE email = $1
      AND date = $2) e
    FULL OUTER JOIN
      (SELECT * FROM morning_reports WHERE email = $1
      AND date = $2) m
    ON e.date = m.date;`,
    email,
    date
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

const avgResults = async (email, type, value) => {
  const res = await executeQuery(
    `SELECT ROUND(AVG(slp_dur), 1) slp_dur, ROUND(AVG(slp_qlty), 1) slp_qlty,
    ROUND(AVG(time_sport), 1) time_sport, ROUND(AVG(time_study), 1) time_study,
    ROUND(AVG(eating), 1) eating,
    ROUND(AVG((SELECT AVG(c) FROM (VALUES(m.mood), (e.mood)) T (c))), 1) mood
    FROM
      (SELECT * FROM evening_reports WHERE email = $1
      AND EXTRACT(${type} FROM date) = $2) e
    FULL OUTER JOIN
      (SELECT * FROM morning_reports WHERE email = $1
      AND EXTRACT(${type} FROM date) = $2) m
    ON e.date = m.date;`,
    email,
    value
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

export { addMorning, addEvening, avgResults, avgMoodByDay };

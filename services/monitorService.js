import {executeQuery} from "../database/database.js";

const addMorning = async (date, slp_dur, slp_qlty, mood, email) => {
  const res = await executeQuery(
    `SELECT EXISTS(SELECT 1 FROM morning_reports
    WHERE date = '${!date ? "CURRENT_DATE" : date}' AND email = '${email}')`
  );
  if (res.rowsOfObjects()[0].exists) {
    await executeQuery(
      `DELETE FROM morning_reports
      WHERE date = '${!date ? "CURRENT_DATE" : date}' AND email = '${email}'`
    );
  }
  await executeQuery(
    `INSERT INTO morning_reports (date, slp_dur, slp_qlty, mood, email)
      VALUES ('${!date ? "CURRENT_DATE" : date}',
       ${slp_dur}, ${slp_qlty}, ${mood}, '${email}')`
  );
};

const addEvening = async (date, sprt_t, std_t, eating, mood, email) => {
  const res = await executeQuery(
    `SELECT EXISTS(SELECT 1 FROM evening_reports
    WHERE date = '${!date ? "CURRENT_DATE" : date}' AND email = '${email}')`
  );
  if (res.rowsOfObjects()[0].exists) {
    await executeQuery(
      `DELETE FROM evening_reports
      WHERE date = '${!date ? "CURRENT_DATE" : date}' AND email = '${email}'`
    );
  }
  await executeQuery(
    `INSERT INTO evening_reports (date, time_sport, time_study, eating, mood, email)
      VALUES ('${
        !date ? "CURRENT_DATE" : date
      }', ${sprt_t}, ${std_t}, ${eating}, '${mood}', '${email}')`
  );
};

const getMoodByDay = async (email, date) => {
  const res = await executeQuery(
    `SELECT ROUND(AVG((SELECT AVG(c) FROM (VALUES(m.mood), (e.mood)) T (c))), 1) mood
    FROM
      (SELECT * FROM evening_reports WHERE email = '${email}'
      AND date = '${date}') e
    FULL OUTER JOIN
      (SELECT * FROM morning_reports WHERE email = '${email}'
      AND date = '${date}') m
    ON e.date = m.date;`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

const avgResultsByWeek = async (email, weeks) => {
  const res = await executeQuery(
    `SELECT ROUND(AVG(slp_dur), 1) slp_dur, ROUND(AVG(slp_qlty), 1) slp_qlty,
    ROUND(AVG(time_sport), 1) time_sport, ROUND(AVG(time_study), 1) time_study,
    ROUND(AVG(eating), 1) eating,
    ROUND(AVG((SELECT AVG(c) FROM (VALUES(m.mood), (e.mood)) T (c))), 1) mood
    FROM
      (SELECT * FROM evening_reports WHERE email = '${email}'
      AND date > now() - interval '${weeks} week') e
    FULL OUTER JOIN
      (SELECT * FROM morning_reports WHERE email = '${email}'
      AND date > now() - interval '${weeks} week') m
    ON e.date = m.date;`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

const getAvgWeekResults = async email => {
  return await avgResultsByWeek(email, 1);
};

const getAvgMonthResults = async email => {
  return await avgResultsByWeek(email, 4);
};

export {
  addMorning,
  addEvening,
  getAvgWeekResults,
  getAvgMonthResults,
  getMoodByDay
};

import {executeQuery} from "../database/database.js";

const addMorning = async (date, slp_dur, slp_qlty, mood, email) => {
  if (date) {
    await executeQuery(
      `INSERT INTO morning_reports (date, slp_dur, slp_qlty, mood, email)
      VALUES ('${date}', ${slp_dur}, ${slp_qlty}, ${mood}, '${email}')`
    );
  } else {
    await executeQuery(
      `INSERT INTO morning_reports (date, slp_dur, slp_qlty, mood, email)
      VALUES (CURRENT_DATE, ${slp_dur}, ${slp_qlty}, ${mood}, '${email}')`
    );
  }
};

const addEvening = async (
  date,
  time_sport,
  time_study,
  eating,
  mood,
  email
) => {
  if (date) {
    await executeQuery(
      `INSERT INTO evening_reports (date, time_sport, time_study, eating, mood, email)
      VALUES
      ('${date}', ${time_sport}, ${time_study}, ${eating}, '${mood}', '${email}')`
    );
  } else {
    await executeQuery(
      `INSERT INTO evening_reports (date, time_sport, time_study, eating, mood, email)
      VALUES
      (CURRENT_DATE, ${time_sport}, ${time_study}, ${eating}, '${mood}', '${email}')`
    );
  }
};

const getMorningResults = async email => {
  const res = await executeQuery(
    `SELECT * FROM morning_reports WHERE email = '${email}'`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  } else return [];
};

const getEveningResults = async email => {
  const res = await executeQuery(
    `SELECT * FROM evening_reports WHERE email = '${email}'`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  } else return [];
};

const getAllResults = async email => {
  return {
    morning: await getMorningResults(email),
    evening: await getEveningResults(email)
  };
};

const getAvgMorningResults = async (email, weeks) => {
  const res = await executeQuery(
    `SELECT trunc(AVG(slp_dur), 1) as slp_dur, trunc(AVG(slp_qlty), 1) as slp_qlty
    FROM morning_reports
    WHERE date > now() - interval '${weeks} week' AND email = '${email}'`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

const getAvgEveningResults = async (email, weeks) => {
  const res = await executeQuery(
    `SELECT trunc(AVG(time_sport), 1) as time_sport,
    trunc(AVG(time_study), 1) as time_study,
    trunc(AVG(eating), 1) as eating
    FROM evening_reports
    WHERE date > now() - interval '${weeks} week' AND email = '${email}'`
  );
  console.log(res);
  if (res && res.rowCount > 0) {
    console.log(res.rowsOfObjects()[0]);
    return res.rowsOfObjects()[0];
  } else return {};
};

const getAvgWeekResults = async email => {
  return Object.assign(
    {},
    await getAvgMorningResults(email, 1),
    await getAvgEveningResults(email, 1)
  );
};

const getAvgMonthResults = async email => {
  return Object.assign(
    {},
    await getAvgMorningResults(email, 4),
    await getAvgEveningResults(email, 4)
  );
};

export {
  addMorning,
  addEvening,
  getMorningResults,
  getEveningResults,
  getAllResults,
  getAvgWeekResults,
  getAvgMonthResults
};

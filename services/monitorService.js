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

const getMorningResults = async email => {
  const res = await executeQuery(
    `SELECT * FROM morning_reports WHERE email = '${email}'`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  } else return [];
};

const getAvgMorningResults = async (email, weeks) => {
  const res = await executeQuery(
    `SELECT trunc(AVG(slp_dur), 1) as slp_dur, trunc(AVG(slp_qlty), 1) as slp_qlty,
    trunc(AVG(mood), 1) as mood
    FROM morning_reports
    WHERE date > now() - interval '${weeks} week' AND email = '${email}'`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

const getAvgWeekMorningResults = async email => {
  return await getAvgMorningResults(email, 1);
};

const getAvgMonthMorningResults = async email => {
  return await getAvgMorningResults(email, 4);
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

export {
  addMorning,
  getMorningResults,
  getEveningResults,
  getAllResults,
  getAvgWeekMorningResults,
  getAvgMonthMorningResults
};

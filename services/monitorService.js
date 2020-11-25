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

export {addMorning, getMorningResults};

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

const avgMorningByWeek = async (email, weeks) => {
  const res = await executeQuery(
    `SELECT trunc(AVG(slp_dur), 1) as slp_dur, trunc(AVG(slp_qlty), 1) as slp_qlty
    FROM morning_reports
    WHERE date > now() - interval '${weeks} week' AND email = '${email}'`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

const avgEveningByWeek = async (email, weeks) => {
  const res = await executeQuery(
    `SELECT trunc(AVG(time_sport), 1) as time_sport,
    trunc(AVG(time_study), 1) as time_study,
    trunc(AVG(eating), 1) as eating
    FROM evening_reports
    WHERE date > now() - interval '${weeks} week' AND email = '${email}'`
  );
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  } else return {};
};

const getAvgWeekResults = async email => {
  return Object.assign(
    {},
    await avgMorningByWeek(email, 1),
    await avgEveningByWeek(email, 1)
  );
};

const getAvgMonthResults = async email => {
  return Object.assign(
    {},
    await avgMorningByWeek(email, 4),
    await avgEveningByWeek(email, 4)
  );
};

export {addMorning, addEvening, getAvgWeekResults, getAvgMonthResults};

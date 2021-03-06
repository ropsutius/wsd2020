import * as monitorService from "../../services/monitorService.js";
import * as utils from "../../utils/utils.js";
import {
  validate,
  required,
  isNumber,
  minNumber,
  isInt,
  numberBetween,
  isDate
} from "../../deps.js";

const validationMorning = {
  morning_date: [required, isDate],
  sleep_duration: [required, isNumber, minNumber(0)],
  sleep_quality: [required, isInt, numberBetween(1, 5)],
  morning_mood: [required, isInt, numberBetween(1, 5)]
};

const validationEvening = {
  evening_date: [required, isDate],
  time_sport: [required, isNumber, minNumber(0)],
  time_study: [required, isNumber, minNumber(0)],
  eating: [required, isInt, numberBetween(1, 5)],
  evening_mood: [required, isInt, numberBetween(1, 5)]
};

const getData = async user => {
  const data = {
    sleep_duration: null,
    sleep_quality: null,
    time_sport: null,
    time_study: null,
    eating: null,
    evening_mood: null,
    morning_mood: null,
    evening_date: new Date().toISOString().slice(0, 10),
    morning_date: new Date().toISOString().slice(0, 10),
    isMorningReport: false,
    isEveningReport: false,
    showMorning: false,
    showEvening: false,
    user: user,
    errors: []
  };
  if (await monitorService.hasReported(user.email, "morning_reports"))
    data.isMorningReport = true;
  if (await monitorService.hasReported(user.email, "evening_reports"))
    data.isEveningReport = true;
  if (!data.isMorningReport) {
    data.showMorning = true;
  } else if (!data.isEveningReport) {
    data.showEvening = true;
  }
  return data;
};

const getIndex = async ({ render, session }) => {
  const user = await session.get("user");
  let date = new Date();
  date.setDate(date.getDate() - 1);
  let today = null;
  let yesterday = null;

  if (user) {
    today = await monitorService.avgMoodByDay(
      user.email,
      new Date().toLocaleDateString()
    );
    yesterday = await monitorService.avgMoodByDay(
      user.email,
      date.toLocaleDateString()
    );
  }

  render("index.ejs", { today: today, yesterday: yesterday, user: user });
};

const getSummary = async ({ render, request, session }) => {
  const user = await session.get("user");
  let month = request.url.searchParams.get("month");
  let week = request.url.searchParams.get("week");
  let year = new Date().getFullYear();

  if (month) {
    let split = month.split("-");
    year = Number(split[0]);
    month = Number(split[1]);
  } else {
    month = new Date().getMonth() + 1;
  }

  if (week) {
    let split = week.split("-");
    year = Number(split[0]);
    week = Number(split[1].replace("W", ""));
  } else {
    week = utils.getNumberOfWeek();
  }

  render("summary.ejs", {
    week: await monitorService.avgResults(user.email, "WEEK", week, year),
    month: await monitorService.avgResults(user.email, "MONTH", month, year),
    weekValue: utils.getWeekString(week),
    monthValue: utils.getMonthString(month),
    user: user
  });
};

const getReporting = async ({ render, session }) => {
  const user = await session.get("user");
  const data = await getData(user);

  render("reporting.ejs", data);
};

const postMorningReport = async ({ request, response, session, render }) => {
  const user = await session.get("user");
  const body = request.body();
  const params = await body.value;

  const data = await getData(user);

  data.sleep_duration = Number(params.get("slp_dur"));
  data.sleep_quality = Number(params.get("slp_qlty"));
  data.morning_mood = Number(params.get("morning_mood"));
  data.morning_date = params.get("morning_date");

  const [passes, errors] = await validate(data, validationMorning);

  if (!passes) {
    data.showEvening = false;
    data.showMorning = true;
    data.errors = errors;
    render("reporting.ejs", data);
  } else {
    await monitorService.addMorning(
      data.morning_date,
      data.sleep_duration,
      data.sleep_quality,
      data.morning_mood,
      user.email
    );
    response.redirect("/behavior/summary");
  }
};

const postEveningReport = async ({ request, response, session, render }) => {
  const user = await session.get("user");
  const body = request.body();
  const params = await body.value;

  const data = await getData(user);

  data.time_sport = Number(params.get("time_sport"));
  data.time_study = Number(params.get("time_study"));
  data.eating = Number(params.get("eating"));
  data.evening_mood = Number(params.get("evening_mood"));
  data.evening_date = params.get("evening_date");

  const [passes, errors] = await validate(data, validationEvening);

  if (!passes) {
    data.showEvening = true;
    data.showMorning = false;
    data.errors = errors;
    render("reporting.ejs", data);
  } else {
    await monitorService.addEvening(
      data.evening_date,
      data.time_sport,
      data.time_study,
      data.eating,
      data.evening_mood,
      user.email
    );
    response.redirect("/behavior/summary");
  }
};

export {
  getIndex,
  getReporting,
  getSummary,
  postMorningReport,
  postEveningReport
};

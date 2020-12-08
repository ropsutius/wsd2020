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

const getData = () => {
  return {
    sleep_duration: null,
    sleep_quality: null,
    time_sport: null,
    time_study: null,
    eating: null,
    evening_mood: null,
    morning_mood: null,
    evening_date: new Date().toISOString().slice(0, 10),
    morning_date: new Date().toISOString().slice(0, 10),
    errors: []
  };
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

  if (month) month = Number(month.split("-")[1]);
  else month = new Date().getMonth() + 1;

  if (week) week = Number(week.split("-")[1].replace("W", ""));
  else week = utils.getNumberOfWeek();

  render("summary.ejs", {
    week: await monitorService.avgResults(user.email, "WEEK", week),
    month: await monitorService.avgResults(user.email, "MONTH", month),
    user: user
  });
};

const getReporting = async ({ render, session }) => {
  const user = await session.get("user");
  const data = getData();

  if (await monitorService.hasReported(user.email, "morning_reports"))
    data.morning = true;
  if (await monitorService.hasReported(user.email, "evening_reports"))
    data.evening = true;

  data.user = user;

  render("reporting.ejs", data);
};

const postMorningReport = async ({ request, response, session, render }) => {
  const user = await session.get("user");
  const body = request.body();
  const params = await body.value;

  const data = getData();

  data.sleep_duration = Number(params.get("slp_dur"));
  data.sleep_quality = Number(params.get("slp_qlty"));
  data.morning_mood = Number(params.get("morning_mood"));
  data.morning_date = params.get("morning_date");

  const [passes, errors] = await validate(data, validationMorning);

  if (!passes) {
    data.errors = errors;
    data.user = user;
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

  const data = getData();

  data.time_sport = Number(params.get("time_sport"));
  data.time_study = Number(params.get("time_study"));
  data.eating = Number(params.get("eating"));
  data.evening_mood = Number(params.get("evening_mood"));
  data.evening_date = params.get("evening_date");

  console.log(data.evening_mood);
  const [passes, errors] = await validate(data, validationEvening);

  if (!passes) {
    data.errors = errors;
    data.user = user;
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

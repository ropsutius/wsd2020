import * as monitorService from "../../services/monitorService.js";
import * as helperService from "../../services/helperService.js";

const getIndex = async ({render}) => {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  render("index.ejs", {
    today: await monitorService.avgMoodByDay(
      "ropsutius@gmail.com",
      new Date().toLocaleDateString()
    ),
    yesterday: await monitorService.avgMoodByDay(
      "ropsutius@gmail.com",
      date.toLocaleDateString()
    )
  });
};

const getSummary = async ({render, request}) => {
  let month = request.url.searchParams.get("month");
  let week = request.url.searchParams.get("week");

  if (month) month = Number(month.split("-")[1]);
  else month = new Date().getMonth() + 1;

  if (week) week = Number(week.split("-")[1].replace("W", ""));
  else week = helperService.getNumberOfWeek();

  render("summary.ejs", {
    week: await monitorService.avgResults("ropsutius@gmail.com", "WEEK", week),
    month: await monitorService.avgResults(
      "ropsutius@gmail.com",
      "MONTH",
      month
    )
  });
};

const getReporting = async ({render}) => {
  render("reporting.ejs");
};

const postMorningReport = async ({request, response}) => {
  const body = request.body();
  const params = await body.value;

  let date = params.get("date");
  if (!date) {
    date = new Date().toLocaleDateString();
  }

  await monitorService.addMorning(
    date,
    params.get("slp_dur"),
    params.get("slp_qlty"),
    params.get("mood"),
    "ropsutius@gmail.com"
  );
  response.body = {status: 200};
};

const postEveningReport = async ({request, response}) => {
  const body = request.body();
  const params = await body.value;

  let date = params.get("date");
  if (!date) {
    date = new Date().toLocaleDateString();
  }

  await monitorService.addEvening(
    date,
    params.get("time_sport"),
    params.get("time_study"),
    params.get("eating"),
    params.get("mood"),
    "ropsutius@gmail.com"
  );
  response.body = {status: 200};
};

export {
  getIndex,
  getReporting,
  getSummary,
  postMorningReport,
  postEveningReport
};

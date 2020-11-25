import * as monitorService from "../../services/monitorService.js";

const getLanding = async ({render}) => {
  render("index.ejs", {
    week: await monitorService.getAvgWeekResults("ropsutius@gmail.com"),
    month: await monitorService.getAvgMonthResults("ropsutius@gmail.com")
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
    "roope@gmail.com"
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

export {getLanding, getReporting, postMorningReport, postEveningReport};

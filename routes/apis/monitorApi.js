import * as apiService from "../../services/apiService.js";

const getSummary = async ({ response }) => {
  response.body = await apiService.getSummary();
};

const avgResults = async ({ response, params }) => {
  response.body = await apiService.avgResults(
    params.year,
    params.month,
    params.day
  );
};

export { getSummary, avgResults };

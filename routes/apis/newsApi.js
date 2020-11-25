import * as newsService from "../../services/newsService.js";

const getNews = async ({response}) => {
  response.body = await newsService.getNews();
};

const getNewsById = async ({response, params}) => {
  let visits = await session.get("visits");
  if (!visits) {
    visits = 1;
  }
  if (visits > 3) {
    response.body = "This content is only for paying users.";
  } else {
    await session.set("visits", visits + 1);
    response.body = await newsService.getNewsById(params.id);
  }
};

const deleteNewsById = async ({response, params}) => {
  newsService.deleteNewsById(params.id);
  response.body = {status: "200"};
};

const addNews = async ({response, request}) => {
  const body = request.body({type: "json"});
  const content = await body.value;

  newsService.addNews(content.title, content.content);
  response.body = {status: "200"};
};

export {getNews, getNewsById, deleteNewsById, addNews};

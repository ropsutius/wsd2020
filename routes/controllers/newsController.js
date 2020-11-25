import * as newsService from "../../services/newsService.js";

const getNews = async ({render}) => {
  render("index.ejs", {news: await newsService.getNews()});
};

const getNewsById = async ({render, params, session, response}) => {
  let visits = await session.get("visits");
  if (!visits) {
    visits = 1;
  }
  if (visits > 3) {
    response.body = "This content is only for paying users.";
  } else {
    await session.set("visits", visits + 1);
    render("news-item.ejs", {item: await newsService.getNewsById(params.id)});
  }
};

export {getNews, getNewsById};

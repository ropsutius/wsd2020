import {executeQuery} from "../database/database.js";

const getNews = async () => {
  const res = await executeQuery("SELECT * FROM news");
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  } else return [];
};

const getNewsById = async id => {
  const res = await executeQuery(`SELECT * FROM news WHERE id = ${id}`);
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects()[0];
  }
};

const deleteNewsById = async id => {
  const res = await executeQuery(`DELETE FROM news WHERE id = ${id}`);
};

const addNews = async (title, content) => {
  const res = await executeQuery(
    `INSERT INTO news (title, content) VALUES ('${title}', '${content}')`
  );
};

export {getNews, getNewsById, deleteNewsById, addNews};

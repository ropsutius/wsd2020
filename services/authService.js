import { executeQuery } from "../database/database.js";

const emailExists = async email => {
  const res = await executeQuery(
    `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`,
    email
  );
  return res.rowsOfObjects()[0].exists;
};

const register = async (email, pwd) => {
  const mail = await emailExists(email);
  if (mail) {
    return true;
  } else {
    await executeQuery(
      `INSERT INTO users (email, pwd) VALUES ($1, $2)`,
      email,
      pwd
    );
    return false;
  }
};

const login = async (email, pwd) => {
  const res = await executeQuery(
    `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND pwd = $2)`,
    email,
    pwd
  );
  return res.rowsOfObjects()[0].exists;
};

export { register, login };

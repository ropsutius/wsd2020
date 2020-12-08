import { executeQuery } from "../database/database.js";
import * as bcrypt from "../deps.js";

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
    const hash = await bcrypt.hash(pwd);
    await executeQuery(
      `INSERT INTO users (email, pwd) VALUES ($1, $2)`,
      email,
      hash
    );
    return false;
  }
};

const login = async (email, pwd) => {
  const res = await executeQuery(`SELECT * FROM users WHERE email = $1`, email);
  if (res && res.rowsOfObjects().length > 0) {
    return bcrypt.compare(pwd, res.rowsOfObjects()[0].pwd);
  } else {
    return false;
  }
};

export { register, login };

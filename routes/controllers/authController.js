import * as authService from "../../services/authService.js";
import { validate, required, isEmail, minLength } from "../../deps.js";

const validationRules = {
  email: [required, isEmail],
  password: [required, minLength(4)]
};

const getRegister = async ({ render }) => {
  render("register.ejs", { email: "", errors: {} });
};

const postRegister = async ({ request, response, render }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const pwd = params.get("pwd");

  const [passes, errors] = await validate(
    { email: email, password: pwd },
    validationRules
  );

  if (!passes) {
    render("register.ejs", { email: email, errors: errors });
  } else {
    const emailExists = await authService.register(email, pwd);
    if (emailExists) {
      render("register.ejs", {
        email: email,
        errors: { email: ["Email already in use"] }
      });
    } else {
      response.redirect("/auth/login");
    }
  }
};

const getLogin = async ({ render }) => {
  render("login.ejs", { errors: {} });
};

const postLogin = async ({ request, response, render, session }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const pwd = params.get("pwd");

  if (await authService.login(email, pwd)) {
    session.set("authenticated", true);
    session.set("user", {
      email: email
    });
    response.redirect("/");
  } else {
    render("login.ejs", {
      errors: { fail: ["email or password is incorrect"] }
    });
  }
};

const logout = async ({ session, response }) => {
  await session.set("authenticated", false);
  await session.set("user", {});
  response.redirect("/");
};

export { getRegister, postRegister, getLogin, postLogin, logout };

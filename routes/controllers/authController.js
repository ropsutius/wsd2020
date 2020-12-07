import * as authService from "../../services/authService.js";
import * as validation from "../../deps.js";

const validationRules = {
  email: [validation.required, validation.isEmail],
  password: [validation.required, validation.minLength(4)]
};

const getRegister = async ({ render }) => {
  render("register.ejs", { email: "", errors: {} });
};

const postRegister = async ({ request, response, render }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const pwd = params.get("pwd");

  const [passes, errors] = await validation.validate(
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

const postLogin = async ({ request, response, render }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get("email");
  const pwd = params.get("pwd");

  if (await authService.login(email, pwd)) {
    response.redirect("/");
  } else {
    render("login.ejs", {
      errors: { fail: ["email or password is incorrect"] }
    });
  }
};

export { getRegister, postRegister, getLogin, postLogin };

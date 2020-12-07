import { send } from "../deps.js";
import { getTimestamp } from "../utils/utils.js";

const errorMiddleware = async (context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
};

const requestTimingMiddleware = async ({ request }, next) => {
  const time = getTimestamp();
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${time} - ${request.method} ${request.url.pathname} - ${ms} ms`);
};

const serveStaticFilesMiddleware = async (context, next) => {
  if (context.request.url.pathname.startsWith("/static")) {
    const path = context.request.url.pathname.substring(7);

    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  } else {
    await next();
  }
};

const authenticationMiddleware = async (
  { session, request, response },
  next
) => {
  if (session && (await session.get("authenticated"))) {
    await next();
  } else if (
    request.url.pathname === "/" ||
    request.url.pathname.startsWith("/auth")
  ) {
    await next();
  } else {
    response.redirect("/auth/login");
  }
};

export {
  errorMiddleware,
  requestTimingMiddleware,
  serveStaticFilesMiddleware,
  authenticationMiddleware
};

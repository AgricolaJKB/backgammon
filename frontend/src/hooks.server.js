import * as auth from "$lib/server/auth.js";

const parse = (cookie) =>
  cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key.trim()] = value;
    return acc;
  }, {});

const handleAuth = async ({ event, resolve }) => {
  const headers = event.request.headers;
  const cookies = parse(headers.get("cookie") || "");

  if (!cookies.AuthorizationToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  try {
    const token = decodeURIComponent(cookies.AuthorizationToken).replace(
      "Bearer ",
      ""
    );

    const valid = auth.validateJWT(token);
    if (!valid) {
      throw new Error("Invalid token");
    }

    const payload = auth.decodeJWT(token);
    const user = { id: payload.userId, username: payload.username };

    event.locals.user = user;
    event.locals.session = token;
  } catch (error) {
    event.locals.user = null;
    event.locals.session = null;
    console.log(error);
  }

  return resolve(event);
};

export const handle = handleAuth;

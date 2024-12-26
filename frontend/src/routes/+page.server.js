import * as auth from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/login");
  }
  return { ...event.locals };
};

export const actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    delete event.locals.user;
    auth.deleteSessionTokenCookie(event);

    return redirect(302, "/login");
  }
};

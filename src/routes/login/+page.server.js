import { hash, verify } from "@node-rs/argon2";
import { encodeBase32LowerCase } from "@oslojs/encoding";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

import { sessionCookieName, setSessionTokenCookie } from "$lib/server/auth";

export const load = async (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }
  return {};
};

export const actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, {
        message:
          "Falscher Nutzer*innenname oder Passwort – hast du dich schon registriert?"
      });
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    if (!validPassword) {
      return fail(400, {
        message:
          "Falscher Nutzer*innenname oder Passwort – hast du dich schon registriert?"
      });
    }

    const jwt = auth.generateJWT({
      userId: existingUser.id,
      username: existingUser.username,
      emoji: existingUser.emoji
    });

    setSessionTokenCookie(
      event,
      "Bearer " + jwt,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    );

    return redirect(302, "/");
  }
};


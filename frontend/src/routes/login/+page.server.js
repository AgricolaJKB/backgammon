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

    if (!validateUsername(username)) {
      return fail(400, { message: "Ungültiger Nutzer*innenname" });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: "Ungültiges Passwort" });
    }

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
      username: existingUser.username
    });

    setSessionTokenCookie(
      event,
      "Bearer " + jwt,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    );

    return redirect(302, "/");
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateUsername(username)) {
      return fail(400, { message: "Ungültiger Nutzer*innenname" });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: "Ungültiges Passwort" });
    }

    const userId = generateUserId();
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    try {
      await db
        .insert(table.user)
        .values({ id: userId, username, passwordHash });

      const jwt = auth.generateJWT({ userId, username });

      setSessionTokenCookie(
        event,
        "Bearer " + jwt,
        new Date(Date.now() + 60 * 60 * 24)
      );
    } catch (e) {
      console.log(e);
      return fail(500, { message: "Das hat nicht geklappt" });
    }
    return redirect(302, "/");
  }
};

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

function validateUsername(username) {
  return (
    typeof username === "string" &&
    username.length >= 3 &&
    username.length <= 31 &&
    /^[a-z0-9_-]+$/.test(username)
  );
}

function validatePassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 3 &&
    password.length <= 255
  );
}

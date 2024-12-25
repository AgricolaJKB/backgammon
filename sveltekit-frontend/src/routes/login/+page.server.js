import { hash, verify } from "@node-rs/argon2";
import { encodeBase32LowerCase } from "@oslojs/encoding";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

import { sessionCookieName } from "$lib/server/auth";

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
      return fail(400, { message: "Invalid username" });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: "Invalid password" });
    }

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    if (!validPassword) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const jwt = auth.generateJWT({
      userId: existingUser.id,
      username: existingUser.username
    });

    event.cookies.set(sessionCookieName, "Bearer " + jwt, {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 1 day
    });

    return redirect(302, "/");
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateUsername(username)) {
      return fail(400, { message: "Invalid username" });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: "Invalid password" });
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

      event.cookies.set(sessionCookieName, "Bearer " + jwt, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 // 1 day
      });
    } catch (e) {
      return fail(500, { message: "An error has occurred" });
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
    password.length >= 6 &&
    password.length <= 255
  );
}
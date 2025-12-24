import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { generateJWT, setSessionTokenCookie } from '$lib/server/auth';

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');
		const emoji = formData.get('emoji');

		if (!username || !email || !password || !confirmPassword || !emoji) {
			return fail(400, { message: 'Alle Felder sind erforderlich' });
		}

		if (!validateUsername(username)) {
			return fail(400, { message: 'Ungültiger Nutzer*innenname' });
		}

		if (!validatePassword(password)) {
			return fail(400, { message: 'Ungültiges Passwort' });
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwörter stimmen nicht überein' });
		}

		// Check if user exists
		const existingUser = await db
			.select()
			.from(user)
			.where(or(eq(user.username, username), eq(user.email, email)))
			.get();

		if (existingUser) {
			return fail(400, { message: 'Benutzername oder E-Mail ist bereits vergeben' });
		}

		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		const userId = crypto.randomUUID();

		try {
			await db.insert(user).values({
				id: userId,
				username,
				email,
				passwordHash,
				emoji
			});

			const token = generateJWT({
				userId: userId,
				username,
				email,
				emoji
			});

			setSessionTokenCookie(event, token, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)); // 30 days
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Ein Fehler ist beim Erstellen deines Accounts aufgetreten' });
		}

		throw redirect(302, '/');
	}
};

function validateUsername(username) {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[A-Za-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password) {
	return (
		typeof password === 'string' &&
		password.length >= 3 &&
		password.length <= 255
	);
}

import { app } from "../configs/firebase.js";
import { Role } from "@prisma/client";
import { getAuth } from "firebase-admin/auth";
import { authRepo } from "../repo/auth.repo.js";

const auth = getAuth(app);

async function signupWithEmail(
  name: string,
  email: string,
  password: string,
  role: Role,
  company_id?: number
) {
  const existing = await auth.getUserByEmail(email).catch(() => null);

  let fbUser;
  if (existing) {
    fbUser = existing;
  } else {
    fbUser = await auth.createUser({
      displayName: name,
      email,
      password,
    });
  }

  let user = await authRepo.getByEmail(email);
  if (!user) {
    user = await authRepo.create({
      name,
      email,
      role,
      company: company_id ? { connect: { id: company_id } } : undefined,
    });
  }

  const token = await auth.createCustomToken(fbUser.uid);
  return { token, user };
}

async function loginWithEmail(email: string, password: string) {
  const resp = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const data = await resp.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  let user = await authRepo.getByEmail(email);
  if (!user) {
    const fbUser = await auth.getUser(data.localId);
    user = await authRepo.create({
      name: fbUser.displayName ?? "Unknown",
      email: fbUser.email!,
      role: "candidate",
    });
  }

  return { token: data.idToken, user };
}

export const authService = { signupWithEmail, loginWithEmail };

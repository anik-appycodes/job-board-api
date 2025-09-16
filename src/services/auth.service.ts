import { app } from "../configs/firebase.js";
import { getAuth } from "firebase-admin/auth";
import { authRepo } from "../repo/auth.repo.js";

const auth = getAuth(app);

async function signupWithEmail(
  name: string,
  email: string,
  password: string,
  roleName: string,
  company_id?: number
) {
  const existingFbUser = await auth.getUserByEmail(email).catch(() => null);

  const fbUser = existingFbUser
    ? existingFbUser
    : await auth.createUser({ displayName: name, email, password });

  const role = await authRepo.getRoleByName(roleName);

  let user = await authRepo.getByEmail(email);
  if (!user) {
    user = await authRepo.create({
      name,
      email,
      role: { connect: { id: role.id } },
      company: company_id ? { connect: { id: company_id } } : undefined,
    });
  }

  const token = await auth.createCustomToken(fbUser.uid);
  return { token, user };
}

async function loginWithEmail(email: string, password: string) {
  // Call Firebase REST API to authenticate
  const resp = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);

  // Check if user exists in Prisma DB
  const user = await authRepo.getByEmail(email);
  if (!user) {
    throw new Error("User does not exist. Please signup first.");
  }

  // Return Firebase token and user data
  return { token: data.idToken, user };
}

async function loginWithGoogle(
  idToken: string,
  roleName: string = "candidate"
) {
  const decoded = await auth.verifyIdToken(idToken);
  const email = decoded.email!;
  const name = decoded.name ?? "Unknown";

  let user = await authRepo.getByEmail(email);
  if (!user) {
    const role = await authRepo.getRoleByName(roleName);
    user = await authRepo.create({
      name,
      email,
      role: { connect: { id: role.id } },
    });
  }

  const customToken = await auth.createCustomToken(decoded.uid);
  return { token: customToken, user };
}

async function signupWithGoogle(
  idToken: string,
  roleName: string,
  company_id?: number
) {
  const decoded = await auth.verifyIdToken(idToken);
  const email = decoded.email!;
  const name = decoded.name ?? "Unknown";

  const existing = await authRepo.getByEmail(email);
  if (existing) throw new Error("User already exists with this email");

  const role = await authRepo.getRoleByName(roleName);

  const user = await authRepo.create({
    name,
    email,
    role: { connect: { id: role.id } },
    company: company_id ? { connect: { id: company_id } } : undefined,
  });

  const customToken = await auth.createCustomToken(decoded.uid);
  return { token: customToken, user };
}

export const authService = {
  signupWithEmail,
  loginWithEmail,
  loginWithGoogle,
  signupWithGoogle,
};

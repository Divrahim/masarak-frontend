
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthActionState } from "@/lib/auth-form-state";

const SESSION_COOKIE = "masarak-demo-session";

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const displayName = String(
    formData.get("displayName") ?? ""
  ).trim();

  const email = String(
    formData.get("email") ?? ""
  ).trim().toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  if (!displayName || !email || !password) {
    return { error: "Please complete all fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return {
      error: "Your password must be at least 8 characters.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    JSON.stringify({ email, displayName }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  redirect("/onboarding");
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(
    formData.get("email") ?? ""
  ).trim().toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return {
      error: "Your password must be at least 8 characters.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    JSON.stringify({
      email,
      displayName: email.split("@")[0],
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  redirect("/onboarding");
}

export async function signOutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);

  redirect("/login");
}

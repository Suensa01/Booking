import crypto from "crypto";
import { cookies } from "next/headers";

export const DEFAULT_ADMIN_EMAIL = "mohit.work@gmail.com";
export const DEFAULT_ADMIN_PASSWORD = "admin123";

export interface AdminAuthResult {
  authenticated: boolean;
  token?: string;
  error?: string;
  admin?: {
    email: string;
    role: string;
  };
}

export function createAdminToken(email: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "savoria_admin_secret_key_2026";
  const payload = {
    email,
    role: "Administrator",
    issuedAt: Date.now(),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifyAdminToken(token: string | undefined): { valid: boolean; email?: string } {
  if (!token) return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };

  const [data, signature] = parts;
  const secret = process.env.ADMIN_SESSION_SECRET || "savoria_admin_secret_key_2026";
  const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("base64url");

  if (signature !== expectedSignature) return { valid: false };

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    // Expire session after 7 days
    const isExpired = Date.now() - payload.issuedAt > 7 * 24 * 60 * 60 * 1000;
    if (isExpired) return { valid: false };

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export function authenticateAdmin(credentials: {
  email?: string;
  password?: string;
}): AdminAuthResult {
  const expectedEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  const email = credentials.email?.trim().toLowerCase();
  const password = credentials.password?.trim();

  if (!email || !password) {
    return {
      authenticated: false,
      error: "Please enter both admin email and password.",
    };
  }

  if (email === expectedEmail.toLowerCase() && password === expectedPassword) {
    const token = createAdminToken(expectedEmail);
    return {
      authenticated: true,
      token,
      admin: {
        email: expectedEmail,
        role: "Head Chef / Restaurant Manager",
      },
    };
  }

  return {
    authenticated: false,
    error: "Invalid email or password. Please try again.",
  };
}

export async function isAuthorizedAdmin(): Promise<{ authorized: boolean; email?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("savoria_admin_session")?.value;
    const verification = verifyAdminToken(token);
    return { authorized: verification.valid, email: verification.email };
  } catch {
    return { authorized: false };
  }
}

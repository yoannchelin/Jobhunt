import { verifyAccess } from "../utils/auth.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = verifyAccess(token);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
}

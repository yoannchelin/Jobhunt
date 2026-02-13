import jwt from "jsonwebtoken";

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "14d" });
}

export function verifyAccess(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefresh(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export function setAuthCookies(res, { accessToken, refreshToken }) {
  const secure = (process.env.COOKIE_SECURE || "false") === "true";
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/"
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000,
    path: "/api/auth"
  });
}

export function clearAuthCookies(res) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/api/auth" });
}

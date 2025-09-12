import jwt from "jsonwebtoken";

function parseBearerToken(req) {
  const h = req.headers.authorization || req.headers.Authorization;
  if (!h) return null;
  const [scheme, token] = h.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim();
}

export function verifyToken(req, res, next) {
  const token = parseBearerToken(req);
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const isExpired = err?.name === "TokenExpiredError";
    return res.status(401).json({ error: isExpired ? "Token expired" : "Invalid token" });
  }
}

export function optionalAuth(req, res, next) {
  const token = parseBearerToken(req);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }
  next();
}

export function verifyAdmin(req, res, next) {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ error: "Admin access required" });
}

import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "awakened-miracles-secret-key-change-me",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Simple login/logout endpoints (student portal password handles auth)
  app.get("/api/login", (_req, res) => {
    res.redirect("/student-login");
  });

  app.get("/api/logout", (req: any, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  });

  app.get("/api/auth/user", (req: any, res) => {
    if (req.session?.studentPortalAccess) {
      res.json({ id: "student", email: null, firstName: "Student", lastName: "User" });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session?.studentPortalAccess) {
    // Provide a mock user object for compatibility
    req.user = {
      claims: {
        sub: "student-user",
      }
    };
    return next();
  }
  return res.status(401).json({ message: "Unauthorized - please login to student portal" });
};

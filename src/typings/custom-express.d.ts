// custom-express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: AuthUserClaim | string; // Remove JwtPayload if not needed globally
    }
  }
}

export {};

import { JwtPayload } from 'jsonwebtoken';
import { AuthUserClaim } from './user';

declare global {
  namespace Express {
    export interface Request {
      user?: AuthUserClaim | string | JwtPayload;
    }
  }
}

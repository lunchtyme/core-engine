// user.d.ts

import { UserAccountType } from '../infrastructure/database/models/enums';

declare interface AuthUserClaim {
  sub: mongoose.Types.ObjectId | string;
  account_type: UserAccountType;
}

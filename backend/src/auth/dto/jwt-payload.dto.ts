import { UserRole } from '@prisma/client';

export class JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

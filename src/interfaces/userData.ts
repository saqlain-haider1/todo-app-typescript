import { Request } from 'express';
export interface userSignupDetails extends Request {
  name: string;
  email: string;
  password: string;
}

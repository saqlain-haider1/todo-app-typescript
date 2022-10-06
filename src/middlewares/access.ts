import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
export const checkAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req?.body;
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      if (user.toJSON().role === 'admin') {
      } else {
        throw new Error('Forbidden user');
      }
      next();
    }
  } catch (err: any) {
    return res.json({ error: err.message });
  }
};

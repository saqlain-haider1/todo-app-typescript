import { NextFunction, Request, Response } from 'express';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
const filename = 'request-log.json';
export const logRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let requestMethod = req.method;
    const data = { Request: `${requestMethod}: ${req.url} -- ${new Date()}` };
    await fsPromises.appendFile(
      join('src/log/', filename),
      JSON.stringify(data, null, 2) + '\n'
    );
    next();
  } catch (err) {
    return next(err);
  }
};

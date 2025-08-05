import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(401).json({
      status: false,
      message: 'Please re-login to use application',
    });
  }

  const bearer = bearerHeader.split(' ');
  const token = bearer[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Token missing, please re-login',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid token, please login again',
    });
  }
};

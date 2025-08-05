import { NextFunction, Request, Response } from 'express'
import { userService } from '../service/users';


export class userController {

  // POST /login
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userManager = new userService();
      const result: any = await userManager.login(req, res, next);
      if (!result.status) {
        return res.status(400).json({ success: false, message: result.message || 'Something went wrong' });
      }

      return res.status(200).json({ success: true, data: result.data, message: 'Login successful' });
    } catch (error: any) {
       return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  };

  // POST /signup
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userManager = new userService();
      const result: any = await userManager.signup(req, res, next);

      if (!result.status) {
        return res.status(400).json({ success: false, message: result.message || 'Something went wrong' });
      }

      return res.status(201).json({ success: true, data: result.data, message: 'Signup successful' });
    } catch (error: any) {
       return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  };

}
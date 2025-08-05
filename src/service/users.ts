import { NextFunction, Request, Response } from "express";
import { getUserModel } from "../models/users";
const bcrypt = require('bcrypt')
import jwt from 'jsonwebtoken';

export class userService {

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return { status : false, message: 'Email and password are required' };
      }

      const User = getUserModel();

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return { status: false, message: 'User not found' };
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {status: false, message: 'Invalid credentials' };
      }


      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      return {
        status : true,
        message: 'Login successful',
        data :{
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }

  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return { status: false, message: "Required Fields" };
      }

      const User = getUserModel();

      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { status: false, message: "User already exists with this email" };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return {
        status: true,
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        message: "Successfull Sign up"
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }








}


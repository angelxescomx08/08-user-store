import { Request, Response } from "express";

export class AuthController {
  constructor(){

  }

  registerUser = (req: Request, res: Response) => {
    res.send('registerUser');
  }

  loginUser = (req: Request, res: Response) => {
    res.send('loginUser');
  }

  validateEmail = (req: Request, res: Response) => {
    res.send('validateEmail');
  }
}
import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(
    public readonly authService: AuthService
  ){

  }

  registerUser = (req: Request, res: Response) => {
    const [error,registerUserDto] = RegisterUserDto.create(req.body);
    if(error) return res.status(400).send({error});
    
    this.authService.registerUser(registerUserDto!)
      .then((data) => res.send(data))
      .catch((error) => res.status(400).send({error}));
  }

  loginUser = (req: Request, res: Response) => {
    res.send('loginUser');
  }

  validateEmail = (req: Request, res: Response) => {
    res.send('validateEmail');
  }
}
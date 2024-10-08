import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(
    public readonly authService: AuthService
  ){ }

  private handleError = (error: any, res: Response) => {
    if(error instanceof CustomError) 
      return res.status(error.statusCode).send({error: error.message});
    res.status(500).send({error: 'Internal server error'});
  }

  registerUser = (req: Request, res: Response) => {
    const [error,registerUserDto] = RegisterUserDto.create(req.body);
    if(error) return res.status(400).send({error});
    
    this.authService.registerUser(registerUserDto!)
      .then((data) => res.send(data))
      .catch((error) => this.handleError(error,res));
  }

  loginUser = (req: Request, res: Response) => {
    const [error,loginUserDto] = LoginUserDto.create(req.body);
    if(error) return res.status(400).send({error});
    
    this.authService.loginUser(loginUserDto!)
      .then((data) => res.send(data))
      .catch((error) => this.handleError(error,res));
  }

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    this.authService.validateEmail(token)
      .then((data) => res.json('Email validated'))
      .catch((error) => this.handleError(error,res));
  }
}
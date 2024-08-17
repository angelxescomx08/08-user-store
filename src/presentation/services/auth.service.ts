import { UserModel } from "../../data";
import { CustomError, RegisterUserDto } from "../../domain";

export class AuthService {
  constructor() {
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const exist = await UserModel.findOne({ email: registerUserDto.email });
    if(exist)throw CustomError.badRequest('Email already exists');

    return 'todo ok';
  }
}
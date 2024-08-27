import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
  constructor() {
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const exist = await UserModel.findOne({ email: registerUserDto.email });
    if(exist)throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);
      await user.save();

      const {password, ...rest} = UserEntity.fromObject(user);

      return {
        user: {...rest},
        token : 'token'
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
    
  }
}
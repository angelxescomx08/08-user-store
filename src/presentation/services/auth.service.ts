import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
  constructor() {
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const exist = await UserModel.findOne({ email: registerUserDto.email });
    if(exist)throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      const {password, ...rest} = UserEntity.fromObject(user);

      return {
        user: {...rest},
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({
      email: loginUserDto.email
    });

    if(!user)throw CustomError.badRequest('Email or password is invalid');

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);

    if(!isMatching)throw CustomError.badRequest('Email or password is invalid');

    const {password, ...rest} = UserEntity.fromObject(user);

    return {
      user: {...rest},
      token: 'token'
    };

  }
}
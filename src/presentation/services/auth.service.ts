import { bcryptAdapter, envs } from "../../config";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  constructor( 
    private readonly emailService: EmailService,
  ) {
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const exist = await UserModel.findOne({ email: registerUserDto.email });
    if(exist)throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      await this.sendEmailValidationLink(user.email);

      const {password, ...rest} = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({
        id: user._id,
      });
  
      if(!token)throw CustomError.internalServer('Error while generating token');

      return {
        user: {...rest},
        token
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

    const token = await JwtAdapter.generateToken({
      id: user._id,
    });

    if(!token)throw CustomError.internalServer('Error while generating token');

    return {
      user: {...rest},
      token
    };

  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({email});
    if(!token)throw CustomError.internalServer('Error while generating token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const html = `
      <h1>Click the link below to validate your email</h1>
      <a href="${link}">Validate Email: ${email}</a>
    `

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);

    if(!isSent)throw CustomError.internalServer('Error while sending email');

    return true;
  }

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if(!payload)throw CustomError.unauthorized('Invalid token');

    const { email } = payload as {email: string};

    if(!email)throw CustomError.internalServer('Email not found in token');

    const user = await UserModel.findOne({email});

    if(!user)throw CustomError.internalServer('User not found');

    user.emailValidated = true;

    await user.save();

    return true;
    
  }
}
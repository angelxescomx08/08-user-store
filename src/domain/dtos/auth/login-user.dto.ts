import { regularExps } from "../../../config";

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string,
  ) {}
  
  public static create(object: any): [string?, LoginUserDto?] {
    const { email, password } = object;
    
    if(!email) return ["Email is required"];
    if(regularExps.email.test(email as string) === false) return ["Email is invalid"];
    if(!password) return ["Password is required"];
    if((password as string).length < 6) return ["Password must have at least 6 characters"];
    
    return [undefined, new LoginUserDto(
      email as string,
      password as string
    )];
  }
}
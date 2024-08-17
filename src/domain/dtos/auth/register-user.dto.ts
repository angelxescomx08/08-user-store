import { regularExps } from "../../../config";

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}
  
  public static create(object: Record<string,unknown>): [string?, RegisterUserDto?] {
    const { name, email, password } = object;
    
    if(!name) return ["Name is required"];
    if(!email) return ["Email is required"];
    if(regularExps.email.test(email as string) === false) return ["Email is invalid"];
    if(!password) return ["Password is required"];
    if((password as string).length < 6) return ["Password must have at least 6 characters"];
    
    return [undefined, new RegisterUserDto(
      name as string,
      email as string,
      password as string
    )];
  }
}
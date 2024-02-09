import { Validators } from "../../../config";

export class LoginUserDto {
  private constructor(
    public email: string,
    public password: string
  ) {}

  static create(object: {[key: string]: any}): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!Validators.email.test(email)) return ['Missing email', undefined];
    if (!password) return ['Missing password', undefined];
    if (password.length < 6) return ['Password too short', undefined];

    return [
      undefined,
      new LoginUserDto(email, password)
    ]
  }
}
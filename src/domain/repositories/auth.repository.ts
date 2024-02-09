import { LoginUserDto } from "../dtos/auth/login-user.dto";
import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { UserEntity } from "../entities/user.entity";

export abstract class AuthRepository {
  abstract loginUser(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
import { Request, Response } from "express"
import { AuthRepository, CustomError, RegisterUserDto } from "../../domain";
import { UserModel } from "../../data/mongodb";
import { RegisterUser } from "../../domain/use-cases";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { LoginUser } from "../../domain/use-cases/auth/login-user.use-case";

export class AuthController {
  // DI 
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((userToken) => res.json({ message: 'User registered', data: userToken }))
      .catch((error) => this.handleError(error, res));
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ message: error });

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then((userToken) => res.json({ message: 'User logged in', data: userToken }))
      .catch((error) => this.handleError(error, res));
  }

  getUsers = (req: Request, res: Response) => {
    UserModel.find()
      .then((users) => res.json({ message: 'Get users', data: users }))
      .catch((error) => this.handleError(error, res)); 
  }
}
import { Request, Response } from "express"
import { AuthRepository, CustomError, RegisterUserDto } from "../../domain";

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

    if (error) {
      return res.status(400).json({ message: error });
    }

    this.authRepository.registerUser(registerUserDto!)
      .then((user) => res.json({ message: 'Register', data: user }))
      .catch((error) => this.handleError(error, res));
  }

  loginUser = (req: Request, res: Response) => {
    res.json({ message: 'Login' })
  }
}
import { Request, Response } from "express"
import { AuthRepository, RegisterUserDto } from "../../domain";

export class AuthController {
  // DI 
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    this.authRepository.registerUser(registerUserDto!)
      .then((user) => res.json({ message: 'Register', data: user }))
      .catch((error) => res.status(500).json({ message: error.message }));
  }

  loginUser = (req: Request, res: Response) => {
    res.json({ message: 'Login' })
  }
}
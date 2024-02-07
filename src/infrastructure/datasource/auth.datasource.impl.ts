import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthDatasourceImpl implements AuthDatasource {
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;
    
    try {
      // TODO: Save user to database
      
      return new UserEntity(
        '1',
        name,
        email,
        password,
        ['ADMIN_ROLE']
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }

  }
}
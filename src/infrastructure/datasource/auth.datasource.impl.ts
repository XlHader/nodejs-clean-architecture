import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashedPassword: string) => boolean;
type UserMapperType = (object: {[key: string]: any}) => UserEntity;

export class AuthDatasourceImpl implements AuthDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    private readonly userMapper: UserMapperType = UserMapper.userEntityFromObject
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;
    
    try {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) throw CustomError.badRequest('Verify your credentials');
      
      const user = await UserModel.create({ name, email, password: this.hashPassword(password) });
      await user.save();

      return this.userMapper(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServerError();
    }

  }
}
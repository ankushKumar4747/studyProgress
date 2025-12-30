import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, LoginUserDto } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    console.log(createUserDto);
    
    const user = new this.userModel(createUserDto);
    console.log(user);
    await user.save();
    // await this.userModel.create({name,email,password});
    return {
      status: 202,
      message: 'User created successfully',
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Password not match');
    }
    const token = jwt.sign({ id: user._id }, 'secretKey');
    return {
      token: token,
    };
  }
}

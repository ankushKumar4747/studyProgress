import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/create-auth.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("createUser")
  async createUser(@Body() createUserDto: CreateUserDto) {
   try{
     return await this.authService.createUser(createUserDto);
   }catch(e){
    console.log(e.message);
    throw new ExceptionsHandler(e.message);
    
   }
  }

  @Post("loginUser")
 async loginUser(@Body() loginUserDto:LoginUserDto){
   try{
    return await this.authService.loginUser(loginUserDto);
   }catch(e){
    console.log(e.message);
    throw new ExceptionsHandler(e.message);
    
   }
  }
}

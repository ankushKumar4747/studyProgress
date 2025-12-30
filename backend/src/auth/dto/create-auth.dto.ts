import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;
    
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class LoginUserDto{
    @IsString()
    email:string

    @IsString()
    password:string
}
import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/user/dtos/user.dto';
import { ENUM_USER_ROLE } from '@modules/user/repository/entities/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class RegisterDto extends PickType(CreateUserDto, [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'address',
    'password',
]) {}
export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;

    @ApiProperty({ example: '7d' })
    expiresIn: string;

    @ApiProperty({ example: 'Bearer' })
    tokenType: string;

    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    userId: string;

    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: '+1234567890' })
    phoneNumber: string;

    @ApiProperty({ example: 'John' })
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    lastName: string;

    @ApiProperty({ example: 'user', enum: ENUM_USER_ROLE })
    role: ENUM_USER_ROLE;
}

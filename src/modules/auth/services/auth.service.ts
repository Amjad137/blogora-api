import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '@modules/user/services/user.service';
import {
    LoginDto,
    RegisterDto,
    AuthResponseDto,
} from '@modules/auth/dtos/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        // Find user by email
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.userService.updateLastLogin(user._id.toString());

        // Generate JWT token
        const payload = { email: user.email, sub: user._id };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            expiresIn: this.configService.get<string>('auth.jwt.expiresIn'),
            tokenType: 'Bearer',
            userId: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { email, password, firstName, lastName } = registerDto;

        // Check if user already exists
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Create user
        const user = await this.userService.create({
            email,
            password,
            firstName,
            lastName,
        });

        // Generate JWT token
        const payload = { email: user.email, sub: user._id };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            expiresIn: this.configService.get<string>('auth.jwt.expiresIn'),
            tokenType: 'Bearer',
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password: _, ...result } = user.toObject();
            return result;
        }
        return null;
    }
}

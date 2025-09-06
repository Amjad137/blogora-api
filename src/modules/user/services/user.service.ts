import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '@modules/user/schemas/user.schema';
import {
    CreateUserDto,
    UpdateUserDto,
    ChangePasswordDto,
    UserResponseDto,
} from '@modules/user/dtos/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const { email, password, ...userData } = createUserDto;

        // Check if user already exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = new this.userModel({
            ...userData,
            email,
            password: hashedPassword,
        });

        const savedUser = await user.save();
        return this.toResponseDto(savedUser);
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userModel.find({ isActive: true }).exec();
        return users.map(user => this.toResponseDto(user));
    }

    async findOne(id: string): Promise<UserResponseDto> {
        const user = await this.userModel.findById(id).exec();
        if (!user || !user.isActive) {
            throw new NotFoundException('User not found');
        }
        return this.toResponseDto(user);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email, isActive: true }).exec();
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.userModel
            .findByIdAndUpdate(
                id,
                { ...updateUserDto },
                { new: true, runValidators: true },
            )
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.toResponseDto(user);
    }

    async changePassword(
        id: string,
        changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password,
        );
        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await this.userModel
            .findByIdAndUpdate(id, { password: hashedNewPassword })
            .exec();
    }

    async remove(id: string): Promise<void> {
        const user = await this.userModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }
    }

    async updateLastLogin(id: string): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(id, { lastLoginAt: new Date() })
            .exec();
    }

    private toResponseDto(user: UserDocument): UserResponseDto {
        const {
            password,
            emailVerificationToken,
            passwordResetToken,
            passwordResetExpires,
            ...userData
        } = user.toObject();
        return userData as UserResponseDto;
    }
}

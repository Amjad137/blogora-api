import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    jwt: {
        secret: process.env.JWT_SECRET || 'secret-jwt-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    bcrypt: {
        saltRounds: 12,
    },
}));

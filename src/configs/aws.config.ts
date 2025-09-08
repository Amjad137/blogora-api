import { registerAs } from '@nestjs/config';

export default registerAs(
    'aws',
    (): Record<string, unknown> => ({
        s3: {
            presignExpired: 30 * 60, // 30 mins
            credential: {
                key: process.env.AWS_S3_CREDENTIAL_KEY,
                secret: process.env.AWS_S3_CREDENTIAL_SECRET,
            },
            region: process.env.AWS_S3_REGION,
            bucket: process.env.AWS_S3_BUCKET,
            baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`,
        },
    }),
);

import { registerAs } from '@nestjs/config';

export default registerAs(
    'database',
    (): Record<string, any> => ({
        url: process.env?.DATABASE_URL ?? 'mongodb://localhost:27017/blogora',
        debug: process.env.DATABASE_DEBUG === 'true',
        options: {
            // Connection timeout options
            serverSelectionTimeoutMS: 5000, // 5 secs (reduced from 30)
            socketTimeoutMS: 45000, // 45 secs
            heartbeatFrequencyMS: 10000, // 10 secs (reduced from 5)

            // Connection pool options
            maxPoolSize: 10, // Reduced from 20 for Cloud Run
            minPoolSize: 2, // Reduced from 5 for Cloud Run
            maxIdleTimeMS: 30000, // 30 secs (reduced from 60)
            waitQueueTimeoutMS: 5000, // 5 secs (reduced from 30)

            // Additional performance options
            bufferCommands: false, // Disable mongoose buffering
            // bufferMaxEntries: 0, // Disable mongoose buffering
            retryWrites: true,
            w: 'majority',
        },
    }),
);

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export default async function swaggerInit(
    app: INestApplication,
): Promise<void> {
    const configService = app.get(ConfigService);
    const env: string = configService.get<string>('app.env');
    const version: string = configService.get<string>('app.urlVersion.version');
    const globalPrefix: string = configService.get<string>('app.globalPrefix');

    if (env !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Blogora API')
            .setDescription(
                'A modern blog platform with user management, content management, and interactive features',
            )
            .setVersion(version || '1.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'JWT',
                    description: 'Enter JWT token',
                    in: 'header',
                },
                'JWT-auth',
            )
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Users', 'User management endpoints')
            .addTag('Posts', 'Blog post management endpoints')
            .addTag('Comments', 'Comment system endpoints')
            .addTag('Categories', 'Category management endpoints')
            .addTag('Health', 'Health check endpoints')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
}

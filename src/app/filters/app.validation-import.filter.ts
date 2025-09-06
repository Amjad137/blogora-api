import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';

@Catch()
export class AppValidationImportFilter implements ExceptionFilter {
    private readonly logger = new Logger(AppValidationImportFilter.name);

    async catch(exception: any, host: ArgumentsHost): Promise<void> {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        // Check if it's a file import validation error
        if (exception.message?.includes('File import validation failed')) {
            const responseBody = {
                statusCode: 400,
                message: 'File import validation failed',
                errors: exception.errors || [],
                timestamp: new Date().toISOString(),
                path: request.path,
            };

            response.status(400).json(responseBody);
            return;
        }

        // If not a file import validation error, let it pass through
        throw exception;
    }
}

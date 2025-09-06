import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RequestValidationException } from '@common/request/exceptions/request.validation.exception';

@Catch(HttpException)
export class AppHttpFilter implements ExceptionFilter {
    private readonly logger = new Logger(AppHttpFilter.name);

    private readonly globalPrefix: string;

    constructor(private readonly configService: ConfigService) {
        this.globalPrefix = this.configService.get<string>('app.globalPrefix');
    }

    async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
        console.log('AppHttpFilter caught:', exception.constructor.name);

        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        // Handle RequestValidationException using shared logic
        if (exception instanceof RequestValidationException) {
            this.handleValidationException(exception, request, response);
            return;
        }

        const statusHttp = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message = 'Internal server error';
        let statusCode = statusHttp;

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null
        ) {
            message = (exceptionResponse as any).message || message;
            statusCode = (exceptionResponse as any).statusCode || statusCode;
        }

        const responseBody = {
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.path,
        };

        response.status(statusHttp).json(responseBody);

        return;
    }

    private handleValidationException(
        exception: RequestValidationException,
        request: any,
        response: Response,
    ): void {
        const errors = exception.errors.map(error => ({
            property: error.property,
            message:
                Object.values(error.constraints || {})[0] ||
                `${error.property} is invalid`,
        }));

        response.status(exception.httpStatus).json({
            statusCode: exception.statusCode,
            message: 'Validation errors.',
            path: request.path,
            errors: errors,
        });
    }
}

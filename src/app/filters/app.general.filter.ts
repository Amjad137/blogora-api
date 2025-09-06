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
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AppGeneralFilter implements ExceptionFilter {
    private readonly logger = new Logger(AppGeneralFilter.name);

    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly configService: ConfigService,
    ) {}

    async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        console.log(
            'AppGeneralFilter caught exception:',
            exception.constructor?.name,
        );
        this.logger.error(exception);

        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            const statusHttp = exception.getStatus();

            httpAdapter.reply(ctx.getResponse(), response, statusHttp);
            return;
        }

        // set default
        const statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        const message = 'Internal server error';
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.path,
        };

        response.status(statusHttp).json(responseBody);

        return;
    }
}

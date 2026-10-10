import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host
      .switchToHttp()
      .getResponse<Response>();

    // Handle malformed JSON sent by the client.
    if (this.isMalformedJson(exception)) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid request body.',
      });
      return;
    }

    // Handle known HTTP exceptions.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      let message: unknown;

      if (typeof body === 'string') {
        message = body;
      } else if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body
      ) {
        message = body.message;
      }

      // Ensure validation always returns one string message.
      if (Array.isArray(message)) {
        message = message.find(
          (item): item is string =>
            typeof item === 'string',
        );
      }

      // Give unknown routes the required fixed message.
      if (
        status === HttpStatus.NOT_FOUND &&
        typeof message === 'string' &&
        /^Cannot (GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD) \//.test(
          message,
        )
      ) {
        message = 'Endpoint not found.';
      }

      // Avoid exposing internal server error details.
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        message = 'Something went wrong. Please try again.';
      }

      // Apply a fallback if an exception has no usable message.
      if (typeof message !== 'string' || message.length === 0) {
        if (status === HttpStatus.BAD_REQUEST) {
          message = 'Invalid request body.';
        } else if (status === HttpStatus.NOT_FOUND) {
          message = 'Endpoint not found.';
        } else {
          message = 'Something went wrong. Please try again.';
        }
      }

      response.status(status).json({ message });
      return;
    }

    // Log unexpected errors internally, including their stack traces.
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(String(exception));
    }

    // Do not expose unexpected internal errors to the client.
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong. Please try again.',
    });
  }

  private isMalformedJson(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'type' in exception &&
      exception.type === 'entity.parse.failed'
    );
  }
}
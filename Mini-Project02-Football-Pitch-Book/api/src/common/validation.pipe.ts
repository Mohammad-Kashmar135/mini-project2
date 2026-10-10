import {
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * Returns the first validation message in the same
 * order as the DTO properties.
 */
function getFirstValidationMessage(
  errors: ValidationError[],
): string | undefined {
  for (const error of errors) {
    if (error.constraints) {
      const firstMessage = Object.values(error.constraints)[0];

      if (firstMessage) {
        return firstMessage;
      }
    }

    if (error.children && error.children.length > 0) {
      const childMessage = getFirstValidationMessage(
        error.children,
      );

      if (childMessage) {
        return childMessage;
      }
    }
  }

  return undefined;
}

/**
 * Creates the validation pipe used by the API.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: true,

    exceptionFactory: (errors: ValidationError[]) => {
      const message =
        getFirstValidationMessage(errors) ??
        'Invalid request body.';

      return new BadRequestException(message);
    },
  });
}
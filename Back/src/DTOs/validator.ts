import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as { message: ValidationError[], error: string };
    const validationErrors = exceptionResponse.message;

    // Format the validation errors here
    const formattedErrors = this.formatValidationErrors(validationErrors);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: formattedErrors,
    });
  }

  formatValidationErrors(errors: ValidationError[]): any {
    return 'Invalid request ...'
  }
}

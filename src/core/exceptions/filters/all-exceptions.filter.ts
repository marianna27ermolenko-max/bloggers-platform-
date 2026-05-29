import {
  ArgumentsHost,
  // BadRequestException,
  Catch,
  ExceptionFilter,
  // HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { ErrorResponseBody } from './error-response-body.type';
// import { DomainExceptionCode } from '../domain-exception-codes';
import { Response } from 'express';

//Все ошибки
@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    //ctx нужен, чтобы получить request и response (express). Это из документации, делаем по аналогии
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error(exception);

    //Если сработал этот фильтр, то пользователю улетит 500я ошибка
    const message =
      exception instanceof Error
        ? exception.message
        : 'Unknown exception occurred.';

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorsMessages: [
        {
          field: '',
          message,
        },
      ],
    });
  }

  // private buildResponseBody(
  //   requestUrl: string,
  //   message: string,
  // ): ErrorResponseBody {
  //   //потом надо переписать на геттер configService
  //   const isProduction = process.env.NODE_ENV === 'production';

  //   if (isProduction) {
  //     return {
  //       timestamp: new Date().toISOString(),
  //       path: null,
  //       message: 'Some error occurred',
  //       extensions: [],
  //       code: DomainExceptionCode.InternalServerError,
  //     };
  //   }

  //   return {
  //     timestamp: new Date().toISOString(),
  //     path: requestUrl,
  //     message,
  //     extensions: [],
  //     code: DomainExceptionCode.InternalServerError,
  //   };
  // }
}

// @Catch()
// export class AllHttpExceptionsFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const res = ctx.getResponse<Response>();

//     const errors = this.mapException(exception);

//     res.status(this.getStatus(exception)).json(this.buildResponse(errors));
//   }

//   // --- RESPONSE FORMAT ---
//   private buildResponse(errorsMessages: FieldError[]): APIErrorResult {
//     return { errorsMessages };
//   }

//   // --- MAIN MAPPER ---
//   private mapException(exception: unknown): FieldError[] {
//     // ✅ Validation errors (class-validator / ValidationPipe)
//     if (exception instanceof BadRequestException) {
//       const response = exception.getResponse() as BadRequestResponse;

//       if (typeof response === 'string') {
//         return [
//           {
//             field: null,
//             message: response,
//           },
//         ];
//       }

//       const message = response.message;

//       if (Array.isArray(message)) {
//         return message.map((err: any) => ({
//           field: err.property,
//           message:
//             Object.values(err.constraints ?? {})[0] ?? 'Validation error',
//         }));
//       }

//       return [
//         {
//           field: 'unknown',
//           message: typeof message === 'string' ? message : 'Bad request',
//         },
//       ];
//     }

//     // ✅ Other HTTP errors
//     if (exception instanceof HttpException) {
//       const response = exception.getResponse() as any;

//       return [
//         {
//           field: 'unknown',
//           message:
//             typeof response === 'string'
//               ? response
//               : response.message || 'Http error',
//         },
//       ];
//     }

//     // ❌ Unknown errors (500)
//     return [
//       {
//         field: 'unknown',
//         message:
//           exception instanceof Error
//             ? exception.message
//             : 'Internal server error',
//       },
//     ];
//   }

//   // --- STATUS ---
//   private getStatus(exception: unknown): number {
//     if (exception instanceof HttpException) {
//       return exception.getStatus();
//     }
//     return HttpStatus.INTERNAL_SERVER_ERROR;
//   }
// }

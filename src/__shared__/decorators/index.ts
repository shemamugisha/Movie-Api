/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPropertyOptional,
  ApiPropertyOptions,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  getArraySchema,
  getGenericErrorResponseSchema,
  getGenericResponseSchema,
  getPaginatedSchema,
} from '../utils/swagger.util';
/**
 * Custom implementation of @ApiOperation
 * @param summary description of the operation
 * @returns @ApiOperation
 */
export function Operation(summary: string) {
  return applyDecorators(
    ApiOperation({
      summary,
    }),
  );
}

/**
 * Custom implementation of @ApiResponse for OK responses
 * @param model optional model to be returned
 * @returns @ApiResponse
 */
export function OkResponse(model?: any) {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      ...getGenericResponseSchema(model),
    }),
  );
}

/**
 * Custom implementation of @ApiResponse for POST responses
 * @param model optional model to be returned
 * @returns @ApiResponse
 */
export function CreatedResponse(model?: any) {
  return applyDecorators(
    ApiCreatedResponse({
      ...getGenericResponseSchema(model),
    }),
  );
}
/**
 * Combines error decorator functions for swagger
 * @param errorResponses a list of error response decorator functions
 * @returns wrapper combining all the error decorators
 */
export function ErrorResponses(...errorResponses: any[]) {
  return applyDecorators(
    ApiResponse({
      description: 'Error response schema.',
      ...getGenericErrorResponseSchema(),
    }),
    ...errorResponses.map((e) => e()),
  );
}

/**
 * Custom wrapper for @ApiUnauthorizedResponse
 */
export function UnauthorizedResponse() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}

/**
 * Custom wrapper for @ApiForbiddenResponse
 */
export function ForbiddenResponse() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Forbidden resource',
    }),
  );
}

/**
 * Custom wrapper for @ApiBadRequestResponse
 */
export function BadRequestResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Invalid request',
    }),
  );
}

/**
 * Custom wrapper for @ApiConflictResponse
 */
export function ConflictResponse() {
  return applyDecorators(
    ApiConflictResponse({
      description: 'Conflict',
    }),
  );
}
/**
 * Custom wrapper for @ApiNotFoundResponse
 */
export function NotFoundResponse() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'Resource Not found',
    }),
  );
}

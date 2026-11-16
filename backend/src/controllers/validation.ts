import { Request } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors/AppError';
import { UserDTO } from '../types/domain';

export function parseId(value: unknown, field = 'id'): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError(`El campo "${field}" debe ser un entero positivo`);
  return id;
}

export function requireString(body: unknown, field: string, maxLength = 500): string {
  const value = isRecord(body) ? body[field] : undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BadRequestError(`El campo "${field}" es obligatorio`);
  }
  if (value.length > maxLength) throw new BadRequestError(`El campo "${field}" supera ${maxLength} caracteres`);
  return value.trim();
}

export function optionalString(body: unknown, field: string, maxLength = 500): string | undefined {
  const value = isRecord(body) ? body[field] : undefined;
  if (value === undefined) return undefined;
  return requireString(body, field, maxLength);
}

export function getField(body: unknown, field: string): unknown {
  return isRecord(body) ? body[field] : undefined;
}

export function currentUser(req: Request): UserDTO {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

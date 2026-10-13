export class AppError extends Error {
  public readonly statusCode: number = 400;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

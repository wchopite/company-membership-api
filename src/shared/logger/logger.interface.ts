export interface ILoggerService {
  setContext(context: string): void;
  log(message: any, ...optionalParams: any[]): void;
  error(
    message: any,
    trace?: string,

    ...optionalParams: any[]
  ): void;
  warn(message: any, ...optionalParams: any[]): void;
  debug(message: any, ...optionalParams: any[]): void;
  verbose(message: any, ...optionalParams: any[]): void;

  logRequest(method: string, url: string, params?: any): void;
  logResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ): void;
  logError(error: Error, context?: string): void;
}

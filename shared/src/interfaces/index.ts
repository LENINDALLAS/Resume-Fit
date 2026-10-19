export interface IApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface IApiErrorDetails {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export interface IApiErrorResponse {
  success: false;
  error: IApiErrorDetails;
}

export type IApiResponse<T> = IApiSuccessResponse<T> | IApiErrorResponse;

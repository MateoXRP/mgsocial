import { Merge } from 'type-fest';

export interface OSSNWebServiceResponse {
  merchant: string;
  url: string;
  time_token: number;
  payload: boolean;
  code: string;
  message: string;
}

export type ExtendPayload<T> = Merge<OSSNWebServiceResponse, { payload: T }>;

export interface InfiniteHandler {
  loaded: () => void;
  complete: () => void;
}

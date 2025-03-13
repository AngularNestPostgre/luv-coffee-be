export interface ApiResp<T> {
  code: number;
  data: T;
  success: boolean;
}

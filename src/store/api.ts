import { createAction } from "@reduxjs/toolkit";

enum apiCall {
  began = "api/callBegan",
  success = "api/callSuccess",
  failed = "api/callFailed",
}

interface IApiCall {
  url: string;
  method: string;
  onStart?: string;
  onSuccess?: string;
  onError?: string;
  data?: object | string;
}

export const apiCallBegan = createAction<IApiCall>(apiCall.began);
export const apiCallSuccess = createAction<object | string>(apiCall.success);
export const apiCallFailed = createAction<object | string>(apiCall.failed);

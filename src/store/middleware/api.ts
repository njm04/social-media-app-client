import axios from "axios";
import { Dispatch } from "redux";
import * as actions from "../api";

const baseURL = process.env.REACT_APP_SOCIAL_MEDIA_API_URL;

const api = (store: { dispatch: Dispatch }) => (next: Function) => async (
  action: any
) => {
  if (action.type !== actions.apiCallBegan.type) return next(action);

  const { url, method, onSuccess, data, onStart, onError } = action.payload;

  if (onStart) store.dispatch({ type: onStart });
  next(action);

  try {
    const response: { data: object | string } = await axios.request({
      baseURL,
      url,
      method,
      data,
    });

    store.dispatch(actions.apiCallSuccess(response.data));
    if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    store.dispatch(actions.apiCallFailed(error.message));
    if (onError) store.dispatch({ type: onError, payload: error.message });
  }
};

export default api;

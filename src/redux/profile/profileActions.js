import { SET_USERID } from "./profileTypes";

export const setUserId = (id) => {
  return {
    type: SET_USERID,
    payload: id,
  };
};

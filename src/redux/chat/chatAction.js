import { CHAT_TYPES } from "./chatTypes";

export const setChatType = (type) => {
  return {
    type: CHAT_TYPES.SET_CHAT_TYPE,
    payload: type,
  };
};

export const setOtherUserData = (data) => {
  return {
    type: CHAT_TYPES.SET_OTHER_DATA,
    payload: data,
  };
};

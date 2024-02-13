import { CHAT_TYPES } from "./chatTypes";

const initialState = {
  otherData: {},
  chatType: "",
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_TYPES.SET_CHAT_TYPE:
      return { ...state, chatType: action.payload };
    case CHAT_TYPES.SET_OTHER_DATA:
        return {...state, otherData: action.payload}
    default:
      return state;
  }
};

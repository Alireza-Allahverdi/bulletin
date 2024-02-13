import { AUTH_TYPES } from "./authTypes";

const initalState = {
  v_code: "",
  phoneNumber: "",
  isRegistered: false,
  token: "",
  email: ""
};

export const authReducer = (state = initalState, action) => {
  switch (action.type) {
    case AUTH_TYPES.SET_PHONE_NUMBER:
      return { ...state, phoneNumber: action.payload };
    case AUTH_TYPES.SET_V_CODE:
      return { ...state, v_code: action.payload };
    case AUTH_TYPES.SET_REGISTER_STATE:
      return { ...state, isRegistered: action.payload };
    case AUTH_TYPES.SET_TOKEN:
      return {...state, token: action.payload}
    case AUTH_TYPES.SET_EMAIL:
      return {...state, email: action.payload}
    default:
      return state;
  }
};

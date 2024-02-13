import { AUTH_TYPES } from "./authTypes";

export const setUserPhoneNumber = (phone) => {
  return {
    type: AUTH_TYPES.SET_PHONE_NUMBER,
    payload: phone,
  };
};

export const setVerificationCode = (vCode) => {
  return {
    type: AUTH_TYPES.SET_V_CODE,
    payload: vCode,
  };
};

export const setRegisterState = (state) => {
  return {
    type: AUTH_TYPES.SET_REGISTER_STATE,
    payload: state,
  };
};

export const setToken = (token) => {
  return {
    type: AUTH_TYPES.SET_TOKEN,
    payload: token
  }
}

export const setEmail = (email) => {
  return {
    type: AUTH_TYPES.SET_EMAIL,
    payload: email
  }
}

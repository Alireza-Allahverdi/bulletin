import { SETTING_TYPES } from "./settingTypes";

const initialState = {
  hideProfile: false,
  disableProfile: false,
};

export const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTING_TYPES.HIDE_PROFILE:
      return { ...state, hideProfile: action.payload };
    case SETTING_TYPES.DISABLE_PROFILE:
      return { ...state, disableProfile: action.payload };
    default:
      return state;
  }
};

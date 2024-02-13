import { SETTING_TYPES } from "./settingTypes";

export const hideUserProfile = (state) => {
  return {
    type: SETTING_TYPES.HIDE_PROFILE,
    payload: state,
  };
};

export const disableUserProfile = (state) => {
  return {
    type: SETTING_TYPES.DISABLE_PROFILE,
    payload: state,
  };
};

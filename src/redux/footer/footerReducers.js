import { SET_FOOTER, WHICH_FOOTER } from "./footerTypes";

const initialState = {
  footerState: false,
  footerOption: ""
};

export const footerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FOOTER:
      return { ...state, footerState: action.payload };
    case WHICH_FOOTER:
      return { ...state, footerOption: action.payload };
    default:
      return state
  }
};

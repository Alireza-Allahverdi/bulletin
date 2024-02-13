import { SET_USERID } from "./profileTypes";

const initialState = {
  id: 0,
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERID:
      return { ...state, id: action.payload };
    default:
      return state;
  }
};

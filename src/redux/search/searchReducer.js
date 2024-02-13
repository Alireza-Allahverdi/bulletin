import { SET_SEARCH_DATA } from "./searchTypes";

const initialState = {
  searchType: "",
  searchInput: "",
  groupId: "",
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_DATA:
      return {
        searchType: action.payload.type,
        searchInput: action.payload.search,
        groupId: action.payload.groupId,
      };
    default:
      return state;
  }
};

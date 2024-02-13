import { SET_SEARCH_DATA } from "./searchTypes";

export const setSearchData = (data) => {
  return {
    type: SET_SEARCH_DATA,
    payload: {
      type: data.type,
      search: data.search,
      groupId: data.groupId
    },
  };
};

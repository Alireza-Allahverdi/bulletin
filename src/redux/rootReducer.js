import { combineReducers } from "redux";
import { loaderReducer } from "./loaders/loaderReducer";
import { authReducer } from "./auth/authReducer";
import { footerReducer } from "./footer/footerReducers";
import { settingReducer } from "./setting/settingReducer";
import { profileReducer } from "./profile/profileReducer";
import { chatReducer } from "./chat/chatReducer";
import { searchReducer } from "./search/searchReducer";

const rootReducer = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
  footer: footerReducer,
  setting: settingReducer,
  profile: profileReducer,
  chat: chatReducer,
  search: searchReducer
});

export default rootReducer;

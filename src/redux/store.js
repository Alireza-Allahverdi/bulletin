import {/* applyMiddleware,*/ createStore } from "redux";
import rootReducer from "./rootReducer";
// import { composeWithDevTools } from "@redux-devtools/extension";
// import logger from "redux-logger";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
  // composeWithDevTools(applyMiddleware(logger))
);
export const persistor = persistStore(store);
export default store;

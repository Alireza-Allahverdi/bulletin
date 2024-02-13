import { SET_PAGE_LOADER } from "./loaderTypes";

const initialState = {
    pageLoader: false
}

export const loaderReducer = (state=initialState, action) => {
    switch (action.type) {
        case SET_PAGE_LOADER:
            return {...state, pageLoader:action.payload}
        default:
            return state
    }
}

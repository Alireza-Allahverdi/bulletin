import { SET_PAGE_LOADER } from "./loaderTypes"

export const setPageLoader = (loaderState) => {
    return {
        type: SET_PAGE_LOADER,
        payload: loaderState
    }
}
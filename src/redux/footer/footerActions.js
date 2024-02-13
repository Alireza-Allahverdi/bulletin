import { SET_FOOTER, WHICH_FOOTER } from "./footerTypes"

export const setFooterState = (state) => {
    return {
        type: SET_FOOTER,
        payload:state
    }
}

export const changeFooterOption = (name) => {
    return {
        type: WHICH_FOOTER,
        payload:name
    }
}
import React from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { changeFooterOption } from '../../redux/footer/footerActions'

function Footer() {

    let navigate = useNavigate()
    const footerOptionState = useSelector(state => state.footer.footerOption)
    const dispatch = useDispatch()

    return (
        <div className='footerContainer'>
            {
                footerOptionState === "profile" ?
                    <Icon
                        icon="ri:user-3-fill"
                        // color={footerOptionState === "profile" ? "rgb(61,184,113)" : "white"}
                        onClick={() => {
                            navigate("/profile", { replace: true })
                            dispatch(changeFooterOption("profile"))
                        }}
                    />
                    : <Icon
                        icon="ri:user-3-line"
                        onClick={() => {
                            navigate("/profile", { replace: true })
                            dispatch(changeFooterOption("profile"))
                        }}
                    />
            }
            {
                footerOptionState === "home" ?
                    <Icon
                        icon="material-symbols:home-rounded"
                        // color={footerOptionState === "home" ? "rgb(61,184,113)" : "white"}
                        onClick={() => {
                            navigate("/", { replace: true })
                            dispatch(changeFooterOption("home"))
                        }}
                    />
                    :
                    <Icon
                        icon="material-symbols:home-outline-rounded"
                        // color={footerOptionState === "home" ? "rgb(61,184,113)" : "white"}
                        onClick={() => {
                            navigate("/", { replace: true })
                            dispatch(changeFooterOption("home"))
                        }}
                    />
            }
            {
                footerOptionState === "chat" ?
                    <Icon
                        icon="ph:chat-dots-fill"
                        onClick={() => {
                            navigate("/chats", { replace: true })
                            dispatch(changeFooterOption("chat"))
                        }}
                    />
                    :
                    <Icon
                        icon="ph:chat-dots-light"
                        // color={footerOptionState === "chat" ? "rgb(61,184,113)" : "white"}
                        onClick={() => {
                            navigate("/chats", { replace: true })
                            dispatch(changeFooterOption("chat"))
                        }}
                    />
            }
        </div>
    )
}

export default Footer
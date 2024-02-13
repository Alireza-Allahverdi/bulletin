import { Icon } from '@iconify/react'
import React from 'react'
import { useNavigate } from 'react-router'

function AppBar({ innerText, navigateTo, hasOption, optionClickHandler, onlyCall, image, chatType }) {

    let navigate = useNavigate()

    return (
        <div className='appbarContainer'>
            <div>
                <Icon
                    icon="material-symbols:arrow-back-ios-new-rounded"
                    onClick={() => {
                        if (onlyCall) {
                            onlyCall()
                        }
                        else {
                            navigate(navigateTo, { replace: true })
                        }
                    }}
                />
                {
                    hasOption &&
                        image ?
                        <img src={image} alt={image} />
                        : hasOption && !image ?
                            (
                                chatType === "user" ?
                                    <Icon className="groupOrUserIcon" icon="mdi:user-circle-outline" />
                                    :
                                    <Icon icon="heroicons:user-group-20-solid" />
                            )
                            : ""
                }
                <span>{innerText}</span>
            </div>
            {hasOption && <Icon className="optionIcon" icon="mi:options-vertical" onClick={optionClickHandler} />}
        </div>
    )
}

export default AppBar
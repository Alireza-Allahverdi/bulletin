import React, { Fragment } from 'react'
import { Icon } from '@iconify/react'
import ButtonComp from '../button/ButtonComp'

function MainCards({ image, titleText, underTitleText, buttonInnerText, buttonLight, noButton, customizeButton, customizeStyle, onButtonClick, cardPicClickHandler }) {
    return (
        <div className='cardContainer' style={customizeStyle}>
            <div className="picAndTitleConatiner" onClick={cardPicClickHandler}>
                <div className="mainCardPic">{/* must be infoPic or chatPic in othe components */}
                    {
                        image ?
                            <img src={image} alt="card pic" />
                            :
                            <Icon icon="mdi:account-group" />
                    }
                </div>
                <div className="title">
                    <p>{titleText}</p>
                    {
                        underTitleText !== null && underTitleText !== undefined && underTitleText !== "" ?
                            <p>{underTitleText} members</p>
                            : ""
                    }
                </div>
            </div>
            {/* customizebutton will be an array of objects */}
            {
                noButton ? ""
                    :
                    <div className="buttonContainer">
                        {
                            !customizeButton ||
                                customizeButton.length === 0 ?
                                <ButtonComp innerText={buttonInnerText} light={buttonLight} noBoxShadow={true} onClickHandler={onButtonClick} />
                                :
                                customizeButton.map((item, index) => {
                                    return <Fragment key={index}>
                                        <Icon icon={item.icon} onClick={item.func} color={item.color}/>
                                    </Fragment>
                                })
                        }
                    </div>
            }
        </div>
    )
}

export default MainCards
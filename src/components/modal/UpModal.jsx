import React from 'react'
import InputComp from '../inputs/InputComp'

function UpModal({ question, yesContent, noContent, needsPassword, yesClickHandler, noClickHandler, passowrdChangeHanler }) {
    return (
        <div className='behindModal'>
            <div className="modalUpSelf">
                <p>{question}</p>
                {
                    needsPassword ?
                        <div className="modalPasswordSec">
                            <p>Enter Password:</p>
                            <InputComp noBoxShadow={true} placeHolder={"password"} onChangeHandler={passowrdChangeHanler}/>
                        </div>
                        : ""
                }
                <div className="upModalActions">
                    <button onClick={noClickHandler}>{noContent}</button>
                    <button onClick={yesClickHandler}>{yesContent}</button>
                </div>
            </div>
        </div>
    )
}

export default UpModal
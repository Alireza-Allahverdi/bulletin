import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComp from '../button/ButtonComp'
import { setFooterState } from '../../redux/footer/footerActions'

function Modal({ titlesWithFunctions, cancelCallback }) {

    const footerState = useSelector((state) => state.footer.footerState)

    return (
        <div className='modalBack'>
            <div className="modalSelf" style={{ bottom: footerState ? "52px" : "0" }}>
                <div className="modalOptions">
                    {
                        titlesWithFunctions.length !== 0 ?
                            titlesWithFunctions.map((item, index) => {
                                return <Fragment key={index}>
                                    <p onClick={() => {
                                        item.func()
                                        cancelCallback()
                                    }}>
                                        {item.title}
                                    </p>
                                    {index < titlesWithFunctions.length - 1 && <hr />}
                                </Fragment>
                            })
                            : ""
                    }
                </div>
                <div className="modalCancelBtnCont">
                    <ButtonComp innerText={"Cancel"} onClickHandler={cancelCallback} light={true} cancel />
                </div>
            </div>
        </div>
    )
}

export default Modal
import { Icon } from '@iconify/react'
import React from 'react'
import ButtonComp from '../../../components/button/ButtonComp'

function ConfirmInfoModal(props) {
    return (
        <div className='confirmationModal'>
            <div className="backBtnCotainer">
                <button onClick={props.closeModalFunc}>
                    <Icon icon="ri:close-circle-line" />
                </button>
            </div>
            <div className="userInfoContainer">
                {
                    props.userImg ?
                    <img src={props.userImg} alt={props.userImg} />
                    : <Icon icon="mdi:user-circle-outline" />
                }
                <div className="info">
                    <p>{props.info.f_name}</p>
                    <p>{props.info.l_name}</p>
                    <p>{props.cityName}</p>
                </div>
            </div>
            <ButtonComp innerText={"Continue"} light={true} onClickHandler={props.requestSignUp}/>
        </div>
    )
}

export default ConfirmInfoModal
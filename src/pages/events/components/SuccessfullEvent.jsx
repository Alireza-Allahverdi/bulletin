import React from 'react'
import ButtonComp from '../../../components/button/ButtonComp'
import Lottie from 'react-lottie-player'
import * as successfulGif from "../../../assets/gifs/successful.json"

function SuccessfullEvent({ closeModal }) {

  //TODO add gifs

  return (
    <div className="successfullEventModal">
      <div className="eventContent">
        <Lottie
          animationData={successfulGif}
          play
          loop={false}
        />
        <p>Event was created</p>
        <ButtonComp innerText={"Ok"} onClickHandler={closeModal} />
      </div>
    </div>
  )
}

export default SuccessfullEvent
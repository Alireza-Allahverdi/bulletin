import React, { useState } from 'react'
import AppBar from '../../../components/appBar/AppBar'
import InputComp from '../../../components/inputs/InputComp'
import * as buttonLoader from "../../../assets/gifs/instead-btn-loader.json"
import Lottie from 'react-lottie-player'

function NewTopic({ closeModal, groupName, onCreate, loader }) {

  const [inputFields, setInputFields] = useState({
    title: "",
    info: ""
  })
  const [check, setCheck] = useState(false)

  const changeHandler = (e) => {
    setCheck(false)
    setInputFields({
      ...inputFields,
      [e.target.name]: e.target.value
    })
  }

  const validateAndAccept = () => {
    if (!inputFields.title || !inputFields.info) {
      setCheck(true)
      return
    }
    onCreate(inputFields)
  }

  return (
    <div className='newTopicComp'>
      <AppBar onlyCall={closeModal} innerText={"Topics"} />
      <h3>{groupName}</h3>
      <div className="newTopicContent">
        <div className="inpDiv">
          <InputComp name={"title"} inputType={"text"} labelInnerText={"Topic title"} onChangeHandler={changeHandler} />
          {
            check && !inputFields.title
              ? <p className='error'>title mustn't be empty</p>
              : ""
          }
        </div>
        <div className="inpDiv">
          <p>Provide more information</p>
          <textarea name="info" id="" cols="30" rows="10" onChange={changeHandler}></textarea>
          {
            check && !inputFields.info
              ? <p className='error'>you must give more information about topic</p>
              : ""
          }
        </div>
        <div className="newTopicActions">
          {
            loader ?
              <Lottie
                play
                loop
                animationData={buttonLoader}
                style={{ height: '70px', width: '100%' }}
              />
              :
              <>
                <button onClick={closeModal}>Cancel</button>
                <button onClick={validateAndAccept}>Create</button>
              </>
          }
        </div>
      </div>
    </div>
  )
}

export default NewTopic
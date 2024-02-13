import React from 'react'
import { useState } from 'react'
import AppBar from '../../../components/appBar/AppBar'
import ButtonComp from '../../../components/button/ButtonComp'
import bulletinIcon from "../../../assets/images/bulletinfilled.png"
import DatePicker from 'react-multi-date-picker'
import { toast } from 'react-hot-toast'
import InputComp from '../../../components/inputs/InputComp'
import * as loaderGif from "../../../assets/gifs/instead-btn-loader.json"
import Lottie from 'react-lottie-player'

function NewNote({ groupName, modalCloser, onCreate, loader }) {

    const date = new Date()

    const noteColors = ["#e1da2e", "#5fa9ff", "#f5aa4b", "#94cb57", "#ed98b8"]

    const [noteFields, setNoteFields] = useState({
        note: "",
        color: "#e1da2e",
        title: "",
        expireDate: ""
    })
    const [check, setCheck] = useState(false)

    const changeHandler = (e) => {
        setNoteFields({
            ...noteFields,
            [e.target.name]: e.target.value
        })
    }

    const validateAndAccept = () => {
        if (!noteFields.expireDate || !noteFields.note || !noteFields.title) {
            return toast.error("title or note or expiration date empty", { duration: 2000 })
        }
        onCreate(noteFields)
    }

    return (
        <div className="newNoteModal">
            <AppBar innerText={"Bulletin"} onlyCall={modalCloser} />
            <h3>{groupName}</h3>
            <div className="newNoteContent">
                <div className="noteTitleContainer">
                    <p className="fieldHeader">Note title:</p>
                    <InputComp name={"title"} onChangeHandler={changeHandler} />
                </div>
                <div className="newNoteField" style={{ backgroundColor: noteFields.color }}>
                    <img src={bulletinIcon} alt="" />
                    <textarea
                        name="note"
                        rows="15"
                        placeholder="Write your note here:"
                        // style={{ backgroundColor: noteFields.color }}
                        onChange={changeHandler}
                    >
                    </textarea>
                </div>
                <div className="noteColorPicking">
                    <p>Choose the color of the note:</p>
                    <div className="sampleNotes">
                        {
                            noteColors.map((color, index) => {
                                return <div key={index} className={`sampleNote ${noteFields.color === color ? "selected" : ""}`} style={{ backgroundColor: color }} onClick={() => setNoteFields({ ...noteFields, color })} />
                            })
                        }
                    </div>
                </div>
                <p className="error">{check && "expiration date can't be today or before today"}</p>
                <div className="expireField">
                    <span>Expires</span>
                    <DatePicker
                        className="calender"
                        onChange={(e) => {
                            // use as modele
                            const thisMonth = date.getMonth().toString().length < 2 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
                            const thisDay = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDate()
                            const chosenMonth = e.month.number.toString().length < 2 ? `0${e.month.number}` : e.month.number
                            const chosenDay = e.day.toString().length < 2 ? `0${e.day}` : e.day
                            // console.log(thisMonth, thisDay);
                            // console.log(chosenMonth, chosenDay);
                            if (`${date.getFullYear()}-${thisMonth}-${thisDay}` >= `${e.year}-${chosenMonth}-${chosenDay}`) {
                                setCheck(true)
                                return
                            }
                            setCheck(false)
                            setNoteFields({
                                ...noteFields,
                                expireDate: `${e.year}-${e.month.number}-${e.day}`
                            })
                        }}
                    />
                </div>
                <div className="newNoteActions">
                    {
                        loader ?
                            <Lottie
                                animationData={loaderGif}
                                play
                                loop
                            />
                            :
                            <>
                                <ButtonComp innerText={"Cancel"} cancel onClickHandler={modalCloser} />
                                <ButtonComp innerText={"Create"} light onClickHandler={validateAndAccept} />
                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default NewNote
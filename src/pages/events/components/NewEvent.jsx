import { useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import { Calendar } from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import ButtonComp from '../../../components/button/ButtonComp'
import InputComp from '../../../components/inputs/InputComp'
import Switcher from '../../../components/switcher/Switcher'
import MapModal from './MapModal'
import ImageCropModal from '../../../components/imageCropModal/ImageCropModal'
import SuccessfullEvent from './SuccessfullEvent'
import { fetchApi } from '../../../api/FetchApi'
import * as gif from "../../../assets/gifs/event-gif.json"
import * as blueLoader from "../../../assets/gifs/instead-btn-loader.json"
import Lottie from 'react-lottie-player'

function NewEvent({ onCreate, loader, onCancel }) {

    const UPLOAD_IMAGE = "user/img/s3"

    const ref = useRef()

    const [fields, setFields] = useState({
        time: {
            from: "",
            to: ""
        },
        name: "",
        image: "",
        location: "",
        map: {
            lat: 0,
            lng: 0
        },
        generatedMapLink: "",
        fee: 0,
        paypalEmail: "",
        info: ""
    })
    const [cropModalState, setCropModalState] = useState(false)
    const [onlineEvent, setOnlineEvent] = useState(false)
    const [imageFile, setImageFile] = useState("")
    const [successEventModal, setSuccessEventModal] = useState(false)
    // time states
    const [datePickerStates, setDatePickerStates] = useState({
        from: false,
        to: false
    })
    const [temporalEFrom, setTemporalEFrom] = useState()
    const [temporalETo, setTemporalETo] = useState()
    const [timeForShowFrom, setTimeForShowFrom] = useState("")
    const [timeForShowTo, setTimeForShowTo] = useState("")
    // map stuff
    const [mapModal, setMapModal] = useState(false)
    // error handling
    const [check, setCheck] = useState(false)

    const handleAddingTime = () => {
        if (datePickerStates.from) {
            let righMonth = temporalEFrom.month.number.toString().length < 2 ? `0${temporalEFrom.month.number}` : temporalEFrom.month.number
            let rightDay = temporalEFrom.day.toString().length < 2 ? `0${temporalEFrom.day}` : temporalEFrom.day
            let rightHour = temporalEFrom.hour.toString().length < 2 ? `0${temporalEFrom.hour}` : temporalEFrom.hour
            let rightMinute = temporalEFrom.minute.toString().length < 2 ? `0${temporalEFrom.minute}` : temporalEFrom.minute
            setTimeForShowFrom(`${temporalEFrom.weekDay.shortName}, ${rightDay} ${temporalEFrom.month.shortName} / ${rightHour}:${rightMinute}`)
            setFields({
                ...fields,
                time: {
                    ...fields.time,
                    from: `${temporalEFrom.year}-${righMonth}-${rightDay} ${rightHour}:${rightMinute}`
                }
            })
        }
        else {
            let righMonth = temporalETo.month.number.toString().length < 2 ? `0${temporalETo.month.number}` : temporalETo.month.number
            let rightDay = temporalETo.day.toString().length < 2 ? `0${temporalETo.day}` : temporalETo.day
            let rightHour = temporalETo.hour.toString().length < 2 ? `0${temporalETo.hour}` : temporalETo.hour
            let rightMinute = temporalETo.minute.toString().length < 2 ? `0${temporalETo.minute}` : temporalETo.minute
            setTimeForShowTo(`${temporalETo.weekDay.shortName}, ${rightDay} ${temporalETo.month.shortName} / ${rightHour}:${rightMinute}`)
            setFields({
                ...fields,
                time: {
                    ...fields.time,
                    to: `${temporalETo.year}-${righMonth}-${rightDay} ${rightHour}:${rightMinute}`
                }
            })
        }
        setDatePickerStates({
            from: false,
            to: false
        })
    }

    const handleChangeInputs = (e) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0])
        setCropModalState(true)
    }

    const uploadAndGetUrl = (file) => {
        let formData = new FormData()
        formData.append("file", file)
        fetchApi(UPLOAD_IMAGE, formData, true)
            .then((res) => {
                if (res.data.status_code === 200) {
                    setFields({
                        ...fields,
                        image: res.data.link
                    })
                }
            })
    }

    const handleMapLocationChange = (position) => {
        setFields({
            ...fields,
            map: {
                lat: position[0],
                lng: position[1]
            },
            generatedMapLink: `https://maps.google.com/maps?daddr=${position[0]},${position[1]}&amp;ll=`
        })
        setMapModal(false)
    }

    const validateAndAccept = () => {
        let data = {
            time: fields.time,
            event_name: fields.name,
            map_link: onlineEvent ? "" : fields.map,
            fee: fields.fee,
            peypal_email: fields.paypalEmail,
            dis: fields.info,
            location_link: fields.location,
            img: fields.image,
            on: onlineEvent,
            notGoing: 0,
            maybe: 0,
            going: 0
        }
        if (!fields.time.from || !fields.time.to) {
            setCheck(true)
        }
        onCreate(data)
    }

    return (
        <div className="newEventModal">
            <div className="newEventSelf">
                {/* <AppBar innerText={"New event"} /> */}
                {
                    mapModal ? <MapModal onPositionAccept={handleMapLocationChange} closeModal={() => setMapModal(false)} />
                        : null
                }
                {
                    cropModalState ?
                        <ImageCropModal imageSrc={imageFile} handleCroppedImage={uploadAndGetUrl} modalCloser={() => setCropModalState(false)} />
                        : null
                }
                {
                    successEventModal && <SuccessfullEvent />
                }
                <div className="eventImage">
                    <div className="eventImageLeft">
                        {
                            fields.image ?
                                <>
                                    <img src={fields.image} alt="" style={{ width: "90%" }} />
                                    <div className={`icon ${fields.image ? "image" : ""}`} onClick={() => ref.current.click()}>
                                        <Icon icon="bx:image-add" />
                                    </div>
                                </>
                                :
                                <div className="choosePicture">
                                    Choose a picture
                                    <div className="icon" onClick={() => ref.current.click()}>
                                        <Icon icon="bx:image-add" />
                                    </div>
                                </div>
                        }
                        <input type="file" ref={ref} style={{ display: "none" }} onChange={handleImageChange} />
                    </div>
                    <Lottie
                        play
                        loop
                        animationData={gif}
                        style={{ height: "150px", width: "100%" }}
                    />
                </div>
                <div className="eventDateAndTime">
                    <div>
                        <p className="from">
                            <Icon icon="mdi:clock-time-three-outline" />
                            From
                        </p>
                        <div className="calenderDropDown" onClick={() => setDatePickerStates({ from: !datePickerStates.from, to: false })}>
                            <span>{!!timeForShowFrom ? timeForShowFrom : null}</span>
                            <Icon icon="material-symbols:keyboard-arrow-down-rounded" />
                        </div>
                        {
                            check && fields.from ?
                                <p className="noData">this field is required</p>
                                : ""
                        }
                    </div>
                    <div>
                        <p className="to">To</p>
                        <div className="calenderDropDown" onClick={() => setDatePickerStates({ from: false, to: !datePickerStates.to })}>
                            <span>{!!timeForShowTo ? timeForShowTo : null}</span>
                            <Icon icon="material-symbols:keyboard-arrow-down-rounded" />
                        </div>
                    </div>
                </div>
                {
                    datePickerStates.from || datePickerStates.to ?
                        <div className="calendersAndTimes" style={{ right: datePickerStates.to ? "-30vw" : "0" }}>
                            <Calendar
                                plugins={[<TimePicker position='bottom' hideSeconds />]}
                                onChange={(e) => {
                                    if (datePickerStates.from) {
                                        setTemporalEFrom(e)
                                    }
                                    else if (datePickerStates.to) {
                                        setTemporalETo(e)
                                    }
                                }}
                                value={datePickerStates.from ? temporalEFrom : datePickerStates.to ? temporalETo : ""}
                            />
                            <div className="calenderActions">
                                <button onClick={() => setDatePickerStates({ from: false, to: false })}>Cancel</button>
                                <button onClick={handleAddingTime}>Done</button>
                            </div>
                        </div>
                        : null
                }
                <form action="" className="newEventForm">
                    <InputComp name={"name"} inputType={"text"} iconBeside={"material-symbols:drive-file-rename-outline-outline-rounded"} placeHolder={"Event Name"} onChangeHandler={handleChangeInputs} />
                    <div className="onlineEvents">
                        <p>Online event?</p>
                        <Switcher state={onlineEvent} handleChange={(e) => setOnlineEvent(e)} />
                    </div>
                    <InputComp name={"location"} inputType={"text"} iconBeside={"fluent:location-28-regular"} placeHolder={`location ${onlineEvent ? "Link" : ""}`} onChangeHandler={handleChangeInputs} />
                    {
                        onlineEvent ? ""
                            :
                            <div className="formField">
                                <Icon icon="mdi:link-variant" />
                                <div className={`mapField ${fields.generatedMapLink ? "link" : ""}`} onClick={() => setMapModal(true)}>
                                    <span>
                                        {
                                            fields.generatedMapLink ?
                                                fields.generatedMapLink
                                                :
                                                "Map link"
                                        }
                                    </span>
                                </div>
                            </div>
                    }
                    <InputComp name={"fee"} inputType={"number"} iconBeside={"ph:currency-circle-dollar"} placeHolder={"Fee"} onChangeHandler={handleChangeInputs} />
                    <InputComp name={"paypalEmail"} inputType={"email"} iconBeside={"bi:credit-card-2-front-fill"} placeHolder={"Paypal email"} onChangeHandler={handleChangeInputs} />
                    <div className="moreInfo">
                        <Icon icon="uiw:information-o" />
                        <textarea name="info" rows="5" placeholder="Information" onChange={handleChangeInputs}></textarea>
                    </div>
                </form>
                <div className="newEventActions">
                    {
                        loader ?
                            <Lottie
                                animationData={blueLoader}
                                play
                                loop
                                style={{ width: "100%", height: "80px" }}
                            />
                            :
                            <>
                                <ButtonComp innerText={"Cancel"} cancel onClickHandler={onCancel} />
                                <ButtonComp innerText={"Create"} light onClickHandler={validateAndAccept} />
                            </>
                    }
                </div>
                <br />
            </div>
        </div>
    )
}

export default NewEvent
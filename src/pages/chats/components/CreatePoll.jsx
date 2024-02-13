import { useState } from 'react'
import AppBar from '../../../components/appBar/AppBar'
import InputComp from '../../../components/inputs/InputComp'
import ButtonComp from '../../../components/button/ButtonComp'
import { Icon } from '@iconify/react'
import DatePicker, { Calendar } from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import { useEffect } from 'react'
import Switcher from '../../../components/switcher/Switcher'
import { toast } from 'react-hot-toast'

function CreatePoll({ callbackRequest, cancelCallback }) {

  const [pollQuestion, setPollQuestion] = useState("")
  const [options, setOptions] = useState([
    { option: "" },
    { option: "" }
  ])
  const [calenderState, setCalenderState] = useState("")
  const [dateForShow, setDateForShow] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [multiple, setMultiple] = useState(false)
  const [publicPoll, setPublicPoll] = useState(false)

  const validateAndAccept = () => {
    if (!pollQuestion) {
      return toast.error("Poll question is empty!", { duration: 1500 })
    }
    const checkIfOptionNotEmpty = options.every(item => item.option !== "")
    if (!checkIfOptionNotEmpty) {
      return toast.error("Options must not be empty!", { duration: 1500 })
    }
    if (!date || !time) {
      return toast.error("Date or Time must not be empty!", { duration: 1500 })
    }
    let sendData = {
      question: pollQuestion,
      options,
      endTime: `${date} ${time}`,
      multiple,
      publicPoll
    }
    callbackRequest(sendData)
  }

  const addOptionRow = () => {
    if (options.length < 4) {
      setOptions([
        ...options,
        { option: "" }
      ])
    }
  }

  const handleOptionChange = (e, index) => {
    let cloneData = [...options]
    let cloneObject = { ...options[index] }
    cloneObject.option = e.target.value
    cloneData[index] = cloneObject
    setOptions(cloneData)
  }

  return (
    <div className='pollContainer'>
      <AppBar innerText={"Create poll"} onlyCall={cancelCallback} />
      <div className="pollForm">
        <div className="pollQuestion">
          <InputComp
            inputType={"text"}
            placeHolder={"Type poll question here"}
            iconBeside={"tabler:pencil-minus"}
            labelInnerText
            onChangeHandler={(e) => setPollQuestion(e.target.value)}
          />
        </div>
        <div className="pollOptions">
          <p>Vote options</p>
          {
            options.map((opt, index) => (
              <InputComp
                key={index}
                value={opt.option}
                placeHolder={`${index + 1}.option`}
                onChangeHandler={(e) => handleOptionChange(e, index)}
              />
            ))
          }
          {
            options.length < 4 ?
              <button className="addMore" onClick={addOptionRow}>+ Add more</button>
              : null
          }
        </div>
        <div className="pollEndTime">
          <div className="timeInputs">
            <p className="sectionHeader">Voting Ends</p>
            <div className="fieldWrapper">
              <Icon icon="ic:sharp-access-time" className="" />
              <div className="field" onClick={() => setCalenderState("date")}>
                <p>
                  {
                    !dateForShow ?
                      "Date"
                      : dateForShow
                  }
                </p>
                <Icon icon="material-symbols:keyboard-arrow-down-rounded" />
              </div>
              <div className="field" onClick={() => setCalenderState("time")}>
                {/* <p>
                  {
                    !time ?
                      "Time"
                      : time
                  }
                </p> */}
                <DatePicker
                  disableDayPicker
                  format="HH:mm"
                  plugins={[<TimePicker hideSeconds />]}
                  onChange={(e) => {
                    let rightHour = e.hour.toString().length < 2 ? `0${e.hour}` : e.hour
                    let rightMinute = e.minute.toString().length < 2 ? `0${e.minute}` : e.minute
                    setTime(`${rightHour}:${rightMinute}`)
                  }}
                  placeholder="Time"
                />
                <Icon icon="material-symbols:keyboard-arrow-down-rounded" />
              </div>
            </div>
            <div className="dataAndTimePicker" style={{ right: calenderState === "time" ? "21px" : "" }}>
              {
                calenderState === "date" ?
                  <Calendar
                    onChange={(e) => {
                      let rightMonth = e.month.number.toString().length < 2 ? `0${e.month.number}` : e.month.number
                      let rightDay = e.day.toString().length < 2 ? `0${e.day}` : e.day
                      setDate(`${e.year}-${rightMonth}-${rightDay}`)
                      setDateForShow(`${e.weekDay.shortName}, ${e.weekDay.number} ${e.month.shortName}`)
                    }}
                  />
                  :
                  null
              }
              {
                calenderState === "date"
                  ?
                  <>
                    <button onClick={() => setCalenderState("")}>Cancel</button>
                    <button onClick={() => setCalenderState("")}>Done</button>
                  </>
                  : null
              }
            </div>
          </div>
        </div>
        <div className="pollChoices">
          <span>Multiple answers</span>
          <Switcher state={multiple} handleChange={(e) => setMultiple(e)} />
        </div>
        <div className="pollChoices">
          <span>Public poll</span>
          <Switcher state={publicPoll} handleChange={(e) => setPublicPoll(e)} />
        </div>
        <p className="notice">
          In public poll, everyone in the group can see individual votes.
        </p>
        <div className="pollActions">
          <ButtonComp
            innerText={"Cancel"}
            noBoxShadow
            onClickHandler={cancelCallback}
            cancel
          />
          <ButtonComp
            innerText={"Create"}
            light
            onClickHandler={validateAndAccept}
          />
        </div>
      </div>
    </div>
  )
}

export default CreatePoll
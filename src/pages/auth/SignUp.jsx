import React, { useEffect, useState } from 'react'
import countryCodes from "country-codes-list"
import iconFilled from "../../assets/images/bulletinfilled.png"
import InputComp from '../../components/inputs/InputComp'
import { GoogleLogin } from '@react-oauth/google'
import ButtonComp from '../../components/button/ButtonComp'
import { fetchApi } from '../../api/FetchApi'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import { setRegisterState, setToken, setUserPhoneNumber, setVerificationCode } from '../../redux/auth/authActions'
import { setFooterState } from '../../redux/footer/footerActions'

const countryList = countryCodes.customList("countryNameEn", '+{countryCallingCode}')

function SignUp() {

  const SEND_SMS = "user/sms/verify"
  const SUBMIT_TOKEN = "api/user/google/gmail"

  const dispatch = useDispatch()
  let navigate = useNavigate()

  const [chosenCode, setChosenCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState(0)
  const [googleCredential, setGoogleCredential] = useState("")

  const checkIfEmailInString = (text) => {
    let re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  }

  const sendSms = () => {
    if (!phoneNumber) {
      return toast.error("Phone number is empty", { duration: 1500 })
    }
    dispatch(setPageLoader(true))
    let phoneNumberWithoutZero = phoneNumber[0] === "0" ? phoneNumber.slice(1) : phoneNumber
    let phoneWithPre = ((!chosenCode ? countryList["Andorra"] : chosenCode) + phoneNumberWithoutZero)
    fetchApi(SEND_SMS, { phone_number: phoneWithPre })
      .then((res) => {
        dispatch(setPageLoader(false))
        if (res.data.status_code === 200) {
          dispatch(setUserPhoneNumber(phoneWithPre))
          dispatch(setRegisterState(false))
          navigate("/verify")
        }
        else if (res.data.status_code === 401) {
          toast.error(res.data.description, { duration: 2000 })
        }
        else if (res.data.status_code === 402) {
          toast.error(res.data.description, { duration: 2000 })
        }
      })
      .catch(() => {
        toast.error("Something went wrong!")
      })
  }

  const preNumberChangeHandler = (e) => {
    setChosenCode(e.target.value)
  }

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (checkIfEmailInString(phoneNumber)) {
      navigate("/completeinfo")
    }
    else {
      sendSms()
    }
  }

  useEffect(() => {
    dispatch(setFooterState(false))
    if (googleCredential) {
      fetchApi(SUBMIT_TOKEN, { token: googleCredential })
        .then((res) => {
          if (res.data.status_code === 200) {
            toast.success("Login successful", { duration: 1000 })
            dispatch(setToken(res.data.user_token))
            setTimeout(() => {
              navigate("/")
            }, 1000)
          }
        })
    }
  }, [googleCredential])

  useEffect(() => {
    dispatch(setUserPhoneNumber(""))
    dispatch(setVerificationCode(""))
  }, [])

  return (
    <div className='authPageContainer'>
      <form className="signupForm">
        <div className="signupHeaderContainer">
          <h2>
            <img src={iconFilled} alt="" />
            Bulletin
          </h2>
          <p>Create professional groups & connect</p>
        </div>
        <div className="inputConatiner">
          <select name="" id="" className='countryCodeDropDown' onChange={preNumberChangeHandler}>
            {
              Object.keys(countryList).map((item, index) => {
                return <option value={countryList[item]} key={index}>{`${item} (${countryList[item]})`}</option>
              })
            }
          </select>
          <InputComp placeHolder={"Email or Phone Number"} inputType={"text"} onChangeHandler={handlePhoneChange} />
          <div className="signInWithGoogleCont">
            <p>or</p>
            <GoogleLogin
              context='Signup'
              text='signup_with'
              size='large'
              width={window.innerWidth - "40"}
              onSuccess={credentialResponse => {
                setGoogleCredential(credentialResponse.credential)
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
          <div className="submitButtonContainer">
            <ButtonComp light={true} innerText={"Continue"} fontSize={20} width={120} borderRadius={3} onClickHandler={handleSubmit} />
          </div>
        </div>
      </form>
    </div>
  )
}


export default SignUp
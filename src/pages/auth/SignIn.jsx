import React, { useEffect, useState } from 'react'
import ButtonComp from '../../components/button/ButtonComp'
import InputComp from '../../components/inputs/InputComp'
import countryCodes from "country-codes-list"
import { GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { fetchApi } from '../../api/FetchApi'
import { useDispatch } from 'react-redux'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import { setEmail, setRegisterState, setToken, setUserPhoneNumber, setVerificationCode } from '../../redux/auth/authActions'
import { setFooterState } from '../../redux/footer/footerActions'
import * as signInGif from "../../assets/gifs/signin-gif.json"
import Lottie from 'react-lottie-player'

function SignIn() {

    const countryList = countryCodes.customList("countryNameEn", '+{countryCallingCode}')

    const SUBMIT_TOKEN = "api/user/google/gmail"
    const SEND_SMS = "user/sms/verify"

    let navigate = useNavigate()
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState("")
    const [chosenCode, setChosenCode] = useState("")
    const [tokenFromGoogle, setTokenFromGoogle] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!phoneNumber) {
            return toast.error("input field is empty!", { duration: 1500 })
        }
        dispatch(setPageLoader(true))
        if (checkIfEmailInString(phoneNumber)) {
            dispatch(setEmail(phoneNumber))
            navigate("/emailSignin")
        }
        else {
            let phoneNumberWithoutZero = phoneNumber[0] === "0" ? phoneNumber.slice(1) : phoneNumber
            let phoneWithPre = ((!chosenCode ? countryList["Andorra"] : chosenCode) + phoneNumberWithoutZero)
            fetchApi(SEND_SMS, { phone_number: phoneWithPre })
                .then((res) => {
                    if (res.data.status_code === 403) {
                        dispatch(setUserPhoneNumber(phoneWithPre))
                        dispatch(setRegisterState(false))
                        dispatch(setPageLoader(false))
                        toast.error("This Number hasn't been registered!", { duration: 1500 })
                        setTimeout(() => {
                            navigate("/verify")
                        }, 1000)
                    }
                    else if (res.data.status_code === 200) {
                        dispatch(setUserPhoneNumber(phoneWithPre))
                        dispatch(setRegisterState(true))
                        navigate("/verify")//015791
                    }
                    else if (res.data.status_code === 401) {
                        toast.error(res.data.description, { duration: 2000 })
                    }
                    else if (res.data.status_code === 402) {
                        toast.error(res.data.description, { duration: 2000 })
                    }
                })
                .catch((err) => {
                    dispatch(setPageLoader(false))
                    toast.error("Some thing went wrong!", { duration: 2000 })
                    console.error(err)
                })
        }
    }

    const preNumberChangeHandler = (e) => {
        setChosenCode(e.target.value)
    }

    const checkIfEmailInString = (text) => {
        let re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
        return re.test(text);
    }

    useEffect(() => {
        dispatch(setPageLoader(false))
        dispatch(setFooterState(false))
        if (tokenFromGoogle) {
            dispatch(setPageLoader(true))
            // todo add the token got from google to server and login
            fetchApi(SUBMIT_TOKEN, { token: tokenFromGoogle })
                .then((res) => {
                    dispatch(setPageLoader(false))
                    if (res.data.status_code === 200) {
                        toast.success("Login successful", { duration: 1000 })
                        dispatch(setToken(res.data.user_token))
                        setTimeout(() => {
                            navigate("/")
                        }, 1000)
                    }
                })
        }
    }, [tokenFromGoogle])

    useEffect(() => {
        dispatch(setUserPhoneNumber(""))
        dispatch(setVerificationCode(""))
    }, [])

    return (
        <div className='authPageContainer'>
            <Lottie
                play
                loop
                animationData={signInGif}
                style={{ height: '180px', width: '100%' }}
            />
            <form className='signupForm' onSubmit={handleSubmit}>
                <div className="headerContainer">
                    <h2>Welcome to Bulletin</h2>
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
                    <InputComp inputType={"text"} placeHolder={"Email or Phone Number"} iconInside={"mdi:user"} onChangeHandler={(e) => setPhoneNumber(e.target.value)} />
                    <div className="signInWithGoogleCont">
                        <p>or</p>
                        <GoogleLogin
                            context='Signin'
                            text='signin_with'
                            size='large'
                            width={window.innerWidth - "40"}
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                                setTokenFromGoogle(credentialResponse.credential)
                            }}
                            onError={() => {
                                console.log('error');
                                toast.error('Login Failed', { duration: 2000 });
                            }}
                        />
                    </div>
                </div>
                <div className="submitButtonContainer">
                    <ButtonComp light={true} innerText={"Sign in"} fontSize={20} width={120} borderRadius={3} onClickHandler={handleSubmit} />
                </div>
            </form>
            <p className='notMember'>Not a member? <Link to="/signup">join now</Link></p>
        </div>
    )
}

export default SignIn
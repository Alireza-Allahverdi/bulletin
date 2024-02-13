import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ButtonComp from '../../components/button/ButtonComp'
import InputComp from '../../components/inputs/InputComp'
import { setToken, setVerificationCode } from '../../redux/auth/authActions'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import iconFilled from "../../assets/images/bulletinfilled.png"
import {fetchApi} from '../../api/FetchApi'
import { toast } from 'react-hot-toast'
import { setFooterState } from '../../redux/footer/footerActions'

const SIGNIN = "user/sms/signin"
const CHECK_VERIFICATION = "user/sms/check"
const SEND_SMS = "user/sms/verify"

function Verify() {

    let navigate = useNavigate()
    const phoneNumber = useSelector((state) => state.auth.phoneNumber)
    const isRegistered = useSelector((state) => state.auth.isRegistered)
    const dispatch = useDispatch()
    const [vCode, setVCode] = useState(0)

    const sendSms = () => {
        dispatch(setPageLoader(true))
        fetchApi(SEND_SMS, { phone_number: phoneNumber })
            .then(() => {
                dispatch(setPageLoader(false))
                toast.success("Verification Code has been sent to your phone")
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(setPageLoader(true))
        fetchApi(CHECK_VERIFICATION,
            {
                phone_number: phoneNumber,
                v_code: vCode
            })
            .then((res) => {
                if (res.data.status_code) {
                    if (res.data.status_code === 400) {
                        dispatch(setPageLoader(false))
                        return toast.error(res.data.description, {duration: 4000})
                    }
                }
                if (res.data === "true") {
                    dispatch(setVerificationCode(vCode))
                    if (isRegistered) {
                        fetchApi(SIGNIN, {
                            phone_number: phoneNumber,
                            v_code: vCode
                        })
                            .then((res) => {
                                if (res.data.status_code === 200) {
                                    dispatch(setToken(res.data.user_token))
                                    toast.success("Signed in successfully", { duration: 1500 })
                                    setTimeout(() => {
                                        navigate("/", {replace:true})
                                    }, 1500)
                                }
                                else {
                                    navigate("/completeInfo")
                                }
                            })
                    }
                    else {
                        navigate("/completeinfo")
                    }
                }
                else {
                    dispatch(setPageLoader(false))
                    toast.error("Invalid Verification Code!")
                }
                dispatch(setPageLoader(false))
            }).catch(() => {
                dispatch(setPageLoader(false))
                toast.error("Something went wrong!")
            })
    }

    useEffect(() => {
        dispatch(setFooterState(false))
        dispatch(setPageLoader(false))
    }, [])

    return (
        <div className='authPageContainer'>
            <form className={"signupForm verifyForm"}>
                <div className={`signupHeaderContainer verifyPage`}>
                    <h2>
                        <img src={iconFilled} alt="" />
                        Bulletin
                    </h2>
                    <div className="verifyHeader">
                        <p className='verifyHead'>
                            My Code is
                        </p>
                        <p>We sent a verification code to:</p>
                        <p>{phoneNumber} <span className='changePhoneNumberbtn' onClick={() => navigate(-1, { replace: true })}>change phone number</span></p>
                    </div>
                </div>
                <div className="inputConatiner">
                    <InputComp placeHolder={"Enter Code"} inputType={"number"} onChangeHandler={(e) => setVCode(e.target.value)} iconInside={"mdi:password-outline"} />
                    <p className='sendAgain'>Didn't recieve it? <span onClick={sendSms}>send code again</span></p>
                    <div className="submitButtonContainer">
                        <ButtonComp light={true} innerText={"Continue"} fontSize={20} width={120} borderRadius={3} onClickHandler={handleSubmit} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Verify
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import InputComp from '../../components/inputs/InputComp'
import { useDispatch, useSelector } from 'react-redux'
import Lottie from 'react-lottie-player'
import ButtonComp from '../../components/button/ButtonComp'
import { toast } from "react-hot-toast"
import * as bussinnessArrangingGif from "../../assets/gifs/bussinnesArranging.json"
import { fetchApi } from '../../api/FetchApi'
import { setToken, setUserPhoneNumber, setVerificationCode } from '../../redux/auth/authActions'
import { setPageLoader } from '../../redux/loaders/loaderActions'

function EmailSignIn() {

    const SIGN_IN = "api/user/signin"
    const FORGOT_PASSWORD = "api/user/forget/password"

    const navigate = useNavigate()

    const userEmail = useSelector(state => state.auth.email)
    const dispatch = useDispatch()

    const [email, setEmail] = useState(userEmail)
    const [password, setPassword] = useState("")

    const handleForgetPassword = () => {
        dispatch(setPageLoader(true))
        fetchApi(FORGOT_PASSWORD, { email })
            .then((res) => {
                dispatch(setPageLoader(false))
                if (res.data.status_code === 200) {
                    toast.success("Your password has been sent to your email", { duration: 2000 })
                }
                if (res.data.status_code === 403) {
                    toast.error(res.data.description, {duration: 1500})
                }
            }).catch(() => {
                toast.error("Something went wrong!")
                dispatch(setPageLoader(false))
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(setPageLoader(true))
        fetchApi(SIGN_IN, { password, email })
            .then((res) => {
                dispatch(setPageLoader(false))
                if (res.data.status_code === 200) {
                    toast.success("Login successful", { duration: 1000 })
                    dispatch(setToken(res.data.user_token))
                    setTimeout(() => {
                        navigate("/")
                    }, 1000)
                }
                else if (res.data.status_code === 401) {
                    toast.error(res.data.description, { duration: 2000 })
                    setTimeout(() => {
                        navigate("/completeinfo")
                    }, 1100)
                }
                else if (res.data.status_code === 402) {
                    toast.error(res.data.description, { duration: 2000 })
                }
            }).catch(() => {
                toast.error("Something went wrong!")
                dispatch(setPageLoader(false))
            })
    }

    useEffect(() => {
        dispatch(setPageLoader(false))
            dispatch(setUserPhoneNumber(""))
            dispatch(setVerificationCode(""))
    }, [])

    return (
        <div className='authPageContainer'>
            <Lottie
                play
                loop
                animationData={bussinnessArrangingGif}
                style={{ height: '200px', width: '100%' }}
            />
            <form className='signupForm' onSubmit={handleSubmit}>
                <div className="headerContainer">
                    <h2>Welcome to Bulletin</h2>
                    <p>Create professional groups & connect</p>
                </div>
                <div className="inputConatinerEmail">
                    <InputComp value={email} inputType={"text"} placeHolder={"Email or Phone Number"} iconInside={"mdi:user"} onChangeHandler={(e) => setEmail(e.target.value)} />
                    <InputComp inputType={"text"} placeHolder={"Password"} onChangeHandler={(e) => setPassword(e.target.value)} />
                </div>
                <div className="submitButtonContainer">
                    <ButtonComp light={true} innerText={"Continue"} fontSize={20} width={120} borderRadius={3} onClickHandler={handleSubmit} />
                </div>
            </form>
            <p className='notMemberEmail' onClick={handleForgetPassword}>Forgot Password?</p>
        </div>

    )
}

export default EmailSignIn
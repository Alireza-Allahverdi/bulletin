import React,{ useState ,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as contactusGif from "../../assets/gifs/contact-us-animation.json"
import AppBar from '../../components/appBar/AppBar'
import ButtonComp from '../../components/button/ButtonComp'
import  {fetchApi}  from '../../api/FetchApi'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import { setFooterState } from '../../redux/footer/footerActions'
import { toast } from 'react-hot-toast'
import Lottie from 'react-lottie-player'
import { useNavigate } from 'react-router'

function ContactUs() {

    const CONTACT_US = "api/create/contactus"

    const navigate = useNavigate()

    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()

    const [msg, setMsg]=  useState("")

    const handleMessageSubmit = (e) => {
        e.preventDefault()
        dispatch(setPageLoader(true))
        fetchApi(CONTACT_US, {msg}, false, token)
        .then((res) => {
            dispatch(setPageLoader(false))
            if (res.data.status_code === 200) {
                toast.success("Your message was sent successfully.We will get back to you as soon as possible.", {duration:2000})
                setTimeout(() => {
                    navigate(-1)
                }, 2000)
            }
        })
    }

    useEffect(() => {
        dispatch(setFooterState(false))
    }, [])

    return (
        <div className='contactusPage'>
            <AppBar innerText={"Contact Us"} navigateTo={-1}/>
            <div className="contactGif">
                <Lottie
                    play
                    loop
                    animationData={contactusGif}
                    style={{ height: '250px', width: '100%' }}
                />
            </div>
            <form className="messageInputCont" onSubmit={handleMessageSubmit}>
                <p>Type your message</p>
                <textarea type="text" placeholder='Type your message' onChange={(e) => setMsg(e.target.value)}/>
                <ButtonComp light innerText={"Send"} />
            </form>
        </div>
    )
}

export default ContactUs
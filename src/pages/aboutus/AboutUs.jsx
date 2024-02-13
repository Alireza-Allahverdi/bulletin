import React from 'react'
import AppBar from '../../components/appBar/AppBar'
import aboutUsGif from "../../assets/gifs/aboutus.json"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setFooterState } from '../../redux/footer/footerActions'
import Lottie from 'react-lottie-player'

function AboutUs() {

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setFooterState(false))
    }, [])

    return (
        <div className='aboutUsPage'>
            <AppBar innerText={"About Us"} />
            <div className="aboutUsGif">
                <Lottie
                    play
                    loop
                    animationData={aboutUsGif}
                    style={{ height: '200px', width: '100%' }}
                />
            </div>
            <div className="aboutusContent">
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
            </div>
            <div className="supportCont">
                <Link to={"/support"}>Pay with paypal</Link>
                <Link>Pay with Credit card</Link>
            </div>
        </div>
    )
}

export default AboutUs
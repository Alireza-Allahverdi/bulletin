import React from 'react'
import Lottie from 'react-lottie-player'
import * as loadingGif from "../../assets/gifs/Comp1.json"

function LoadingPage() {
    return (
        <div className='loadingPageCont'>
            <Lottie
                loop
                animationData={loadingGif}
                play
                style={{ width: 150, height: 150 }}
            />
            <p>Please Wait...</p>
        </div>
    )
}

export default LoadingPage
import Lottie from "react-lottie-player"
import * as successGif from "../../assets/gifs/successful.json"
import ButtonComp from "../../components/button/ButtonComp"
import { Icon } from "@iconify/react"

function VerifyInstitution() {
    return (
        <div className="verifyInstitutionalPage">
            <Lottie
                animationData={successGif}
                play
                loop={false}
            />
            <p>your email is verified</p>
            <button>
                <Icon icon="ic:sharp-keyboard-return" />
                <span>
                    Redirect to home page
                </span>
            </button>
        </div>
    )
}

export default VerifyInstitution
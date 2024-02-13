import { useEffect, useState } from "react"
import Lottie from "react-lottie-player"
import AppBar from "../../components/appBar/AppBar"
import * as moneyGif from "../../assets/gifs/moneyGif.json"
import { useDispatch, useSelector } from "react-redux"
import { setFooterState } from "../../redux/footer/footerActions"
import Switcher from "../../components/switcher/Switcher"
import { fetchApi } from "../../api/FetchApi"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import ButtonComp from "../../components/button/ButtonComp"

function BussinessPayment() {

    const GET_BUSSINESS_PLANS = 'api/plan/user/get_all' // number

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()

    const [plans, setPlans] = useState([])
    const [bussiness, setBussiness] = useState(false)
    const [automaticRenewal, setAutomaticRenewal] = useState(false)

    const getBussinessPlans = () => {
        fetchApi(GET_BUSSINESS_PLANS, { number: 1 }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    setPlans(res.data.data)
                }
            })
    }

    useEffect(() => {
        dispatch(setFooterState(false))
        getBussinessPlans()
    }, [])

    return (
        <div>
            <AppBar innerText={'Payment'} navigateTo={-1} />
            <div className="bussinessPay">
                <Lottie
                    animationData={moneyGif}
                    play
                    loop
                />
                <div className="paymentSetting">
                    <p>Business group</p>
                    <Switcher state={true} handleChange={(state) => setBussiness(state)} />
                </div>
                <div className="paymentSetting">
                    <p>Automatic renewals</p>
                    <Switcher state={automaticRenewal} handleChange={(state) => setAutomaticRenewal(state)} />
                </div>
                <div className="plans">
                    <p>Bussiness group fees:</p>
                    {
                        plans.length !== 0 ?
                            plans.map((plan) => (
                                <p key={plan._id}>
                                    Bussiness group {plan.limit} members: {plan.payment}$ / year
                                </p>
                            ))
                            : null
                    }
                    <p>Contact <Link to={'/contactus'}>support team</Link> for any questions</p>
                </div>
                <div className="actions">
                    <ButtonComp innerText={"Cancel"} cancel onClickHandler={() => navigate(-1)} />
                    <ButtonComp innerText={"Continue"} light onClickHandler={() => navigate(`/groupBussinessPayment?id=${searchParams.get('id')}`)} />
                </div>
            </div>
        </div>
    )
}

export default BussinessPayment
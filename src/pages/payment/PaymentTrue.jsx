import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setFooterState } from '../../redux/footer/footerActions'
import ButtonComp from '../../components/button/ButtonComp'
import { useNavigate } from 'react-router'
import acceptImg from "../../assets/images/accept.png"
import logoImg from "../../assets/images/bulletinempty.png"

function PaymentTrue() {

  const navigate = useNavigate()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setFooterState(false))
  }, [])

  return (
    <div className='paymentResultPage'>
      <img src={logoImg} alt="" />
      <img src={acceptImg} alt="" />
      <div className="paymentDesc">
        <h2>Transaction successful</h2>
        <p>
          Your payments was successfully processed. If there is a problem ,Please contact our customer support
        </p>
      </div>
      <ButtonComp innerText={"ok"} noBoxShadow width={150} fontSize={20} onClickHandler={() => navigate('/',{replace: true})} />
    </div>
  )
}

export default PaymentTrue
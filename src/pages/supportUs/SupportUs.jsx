import { useState } from 'react'
import AppBar from '../../components/appBar/AppBar'
import { Icon } from '@iconify/react'
import { fetchApi } from '../../api/FetchApi'
import { useDispatch, useSelector } from 'react-redux'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import toast from 'react-hot-toast'

function SupportUs() {

  const PAY_REQUEST = "api/user/pay/request" // mony, groupid

  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const [paymentInput, setPaymentInput] = useState("")

  const handlePayment = () => {
    if (!paymentInput) return toast.error("Please enter an amount", { duration: 2000 })
    dispatch(setPageLoader(true))
    fetchApi(PAY_REQUEST, { mony: paymentInput, groupid: "" }, false, token)
      .then((res) => {
        dispatch(setPageLoader(false))
        if (res.data.status_code === 200) {
          window.open(res.data.payment_link)
        }
      })
  }

  return (
    <div>
      <AppBar innerText={"Support us"} navigateTo={-1} />
      <div className="supportContent">
        <p className="title">Select payment:</p>
        <div className="paymentNumbers">
          <button className={paymentInput === "5" ? "active" : ""} onClick={() => setPaymentInput("5")}>5$</button>
          <button className={paymentInput === "10" ? "active" : ""} onClick={() => setPaymentInput("10")}>10$</button>
          <button className={paymentInput === "20" ? "active" : ""} onClick={() => setPaymentInput("20")}>20$</button>
          <button className={paymentInput === "50" ? "active" : ""} onClick={() => setPaymentInput("50")}>50$</button>
          <label htmlFor="other">Other:</label>
          <input type="number" value={paymentInput} onChange={(e) => setPaymentInput(e.target.value)} />$
        </div>
        <div className="paymentOptions">
          <p className="title" onClick={handlePayment}>
            Proceed with stripe
            <Icon icon="logos:stripe" />
          </p>
        </div>
      </div>
    </div>
  )
}

export default SupportUs
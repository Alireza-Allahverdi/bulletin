import { useState } from "react"
import { fetchApi } from "../../api/FetchApi"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

function ReportConcern({ type, id, isBlocked, refetchHandler, cancelClickHandler }) {

    const REPORT_CONCERN = "api/chat/one/report"
    const BLOCK_USER = "api/chat/one/block" // userid

    const token = useSelector(state => state.auth.token)

    const [block, setBlock] = useState(false)
    const [text, setText] = useState('')
    const [other, setOther] = useState(false)

    const send = () => {
        if (!isBlocked && block) {
            fetchApi(BLOCK_USER, { userid: id }, false, token)
                .then((res) => {
                    console.log(res);
                })

        }
        fetchApi(
            REPORT_CONCERN,
            {
                reason: text,
                userid: id,
                type
            },
            false,
            token
        )
            .then((res) => {
                if (res.data.status_code === 200) {
                    toast.success("Report Sended!", { duration: 4000 })
                    if (type === 'user') {
                        refetchHandler()
                    }
                    cancelClickHandler()
                }
            })
    }

    return (
        <div className="reportContainer">
            <div className="reportSelf">
                <h3>Report A Concern</h3>
                {
                    type === 'user' && !isBlocked ?
                        <div className="blockCont">
                            <input type="checkbox" name="" id="" onClick={() => setBlock(!block)} />
                            <span>Block the user</span>
                        </div>
                        : null
                }
                <div className="reasonCont">
                    <h3>Reason:</h3>
                    <div className="inputs">
                        <input
                            type="radio"
                            name="spam"
                            id="spam"
                            onClick={() => {
                                setText("spam")
                                setOther(false)
                            }}
                        />
                        <label htmlFor="spam">Fraud or spam</label>
                    </div>
                    <div className="inputs">
                        <input type="radio" name="spam" id="other" onClick={() => setOther(true)} />
                        <label htmlFor="other">Other reason</label>
                    </div>
                    {
                        other &&
                        <textarea
                            cols="30"
                            rows="10"
                            placeholder="Tell us about your concern"
                            style={{ width: "92%" }}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    }
                </div>
                <div className="reportActions">
                    <button onClick={cancelClickHandler}>Cancel</button>
                    <button onClick={send}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default ReportConcern
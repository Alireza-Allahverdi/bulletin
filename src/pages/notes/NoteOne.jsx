import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import { setFooterState } from '../../redux/footer/footerActions'
import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import AppBar from '../../components/appBar/AppBar'
import iconFilled from "../../assets/images/bulletinfilled.png"
import Modal from '../../components/modal/Modal'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import RepComCard from '../../components/activityCards/RepComCard'

function NoteOne() {

    const GET_ONE_NOTE = "api/note/user/get_one" // noteid
    const LIKE_NOTE = "api/note/user/like" // noteid
    const DELETE_NOTE = "api/note/user/delete" // noteid
    const REPLY_NOTE = "api/note/user/reply" // noteid, msg
    const GET_REPLIES = "api/note/user/get_reply" // noteid

    const { noteid } = useParams()
    const navigate = useNavigate()

    const token = useSelector(state => state.auth.token)
    const myUserId = useSelector(state => state.profile.id)
    const dispatch = useDispatch()

    const [noteData, setNoteData] = useState({})
    const [replyData, setReplyData] = useState([])
    const [replyInput, setReplyInput] = useState("")
    const [replyState, setReplyState] = useState(false)
    const [confirmRemovalModalState, setConfirmRemovalModalState] = useState(false)

    const ref = useRef()

    const fetchData = () => {
        fetchApi(GET_ONE_NOTE, { noteid }, false, token)
            .then((res) => {
                dispatch(setPageLoader(false))
                console.log(res);
                setNoteData(res.data.data[0])
            })
    }

    const fetchReplies = () => {
        fetchApi(GET_REPLIES, { noteid }, false, token)
            .then((res) => {
                dispatch(setPageLoader(false))
                console.log(res);
                setReplyData(res.data.data)
            })
    }

    const deleteNote = () => {
        fetchApi(DELETE_NOTE, { noteid }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    toast.success("Note Deleted!", { duration: 1500 })
                    setTimeout(() => {
                        navigate(-1)
                    }, 1500)
                }
            })
    }

    const likeNote = () => {
        fetchApi(LIKE_NOTE, { noteid }, false, token)
            .then(() => {
                fetchData()
            })
    }

    const replyNote = (e) => {
        e.preventDefault()
        dispatch(setPageLoader(true))
        fetchApi(REPLY_NOTE, { msg: replyInput, noteid }, false, token)
            .then((res) => {
                fetchReplies()
                setReplyState(false)
                setReplyInput("")
                console.log(res);
            })
    }

    useEffect(() => {
        dispatch(setPageLoader(true))
        dispatch(setFooterState(false))
        fetchData()
        fetchReplies()
    }, [])

    return (
        <div className="noteOneContainer">
            {
                confirmRemovalModalState ?
                    <Modal
                        titlesWithFunctions={[{ title: "Confirm Removal!", func: deleteNote }]}
                        cancelCallback={() => setConfirmRemovalModalState(false)}
                    />
                    : null
            }
            <AppBar innerText={noteData?.title} navigateTo={-1} />
            {
                noteData.user_info ?
                    <>
                        <div className="noteOneContent">
                            <div className="noteAuthor">
                                <Icon icon="mdi:user-circle" />
                                <span>{noteData?.user_info[0]?.frist_name} {noteData?.user_info[0].last_name}</span>
                            </div>
                            <div className="noteDesc" style={{ backgroundColor: noteData?.color }}>
                                <img src={iconFilled} alt="" />
                                {
                                    noteData?.creator === myUserId ?
                                        <Icon icon="system-uicons:cross-circle" onClick={() => setConfirmRemovalModalState(true)} />
                                        : null
                                }
                                <p>{noteData?.note}</p>
                            </div>
                            <div className="noteOneActions">
                                <button onClick={() => setReplyState(!replyState)}>Reply to the note</button>
                                <div className="noteOneLike" onClick={likeNote}>
                                    <Icon icon="mdi:cards-heart" />
                                    <span>{noteData?.like_number}</span>
                                </div>
                            </div>
                            {
                                replyData.length === 0 ? null
                                    :
                                    <div className="replyContainer">
                                        <p className="title">Replies</p>
                                        {
                                            replyData.map((reply, index) => (
                                                <RepComCard
                                                    key={index}
                                                    time={reply.time}
                                                    dis={reply.reply_msg}
                                                    isNote
                                                />
                                            ))
                                        }
                                    </div>
                            }
                        </div>
                    </>
                    : null
            }
            <br /><br /><br />
            {
                replyState ?
                    <form className="replyInput" onSubmit={replyNote}>
                        <input type="text" onChange={(e) => setReplyInput(e.target.value)} />
                        <button onClick={replyNote}>Post</button>
                    </form>
                    : null
            }
        </div>
    )
}

export default NoteOne
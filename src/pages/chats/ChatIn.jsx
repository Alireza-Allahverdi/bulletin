import { useEffect, useState, useRef, lazy } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { setFooterState } from '../../redux/footer/footerActions'
import InputField from './components/InputField'
import AppBar from '../../components/appBar/AppBar'
// import Modal from '../../components/modal/Modal'
import { fetchApi } from '../../api/FetchApi'
import ChatInCard from './components/ChatInCard'
import { toast } from 'react-hot-toast'
import * as blueLoader from "../../assets/gifs/loader-blue.json"
import Lottie from 'react-lottie-player'
import UpModal from '../../components/modal/UpModal'
import { setPageLoader } from '../../redux/loaders/loaderActions'

const Modal = lazy(() => import('../../components/modal/Modal'))
const CreatePoll = lazy(() => import('./components/CreatePoll'))
const ReportConcern = lazy(() => import('../../components/modal/ReportConcern'))
const VotersModal = lazy(() => import('./components/VotersModal'))

function ChatIn() {

  // DELETE CHAT IS A MYSTERY
  // individual stuff
  const GET_INDIVIDUAL_CHAT_IN = "api/get/chat/one_chat" // userid
  const SEND_INDIVIDUAL_CHAT = "api/chat/one/send" // userid, msg, type
  const LIKE_INDIVIDUAL_CHAT = "api/chat/one/like" // chatid, numberid
  const VOTE_POLL = "api/group/chat/vote"
  const BLOCK_USER = "api/chat/one/block" // userid
  const UNBLOCK_USER = "api/chat/one/unblock"
  const MUTE_INDIVIDUAL_CHAT = "api/mute/chat_one" // userid, status
  const DELETE_CHAT = "api/chat/one/delete" //chatid

  // group stuff
  const GET_GROUP_INFO = "api/user/group/get"
  const GET_GROUP_CHAT_IN = "api/get/chat/one_group" // groupid
  const SEND_CHAT_GROUP = "api/group/chat/send" // msg, type, groupid
  const LIKE_CHAT_GROUP = "api/group/chat/like"
  const MUTE_GROUP = "api/mute/group" // groupid , status
  const DELETE_GROUP = "api/user/group/delete"
  const CREATE_POLL = "api/group/chat/send"
  const CHANGE_VOTE = "api/user/poll/changevote"

  const { id } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { token, myUserId, chatType, otherData } = useSelector(state => {
    return {
      token: state.auth.token,
      myUserId: state.profile.id,
      chatType: state.chat.chatType,
      otherData: state.chat.otherData
    }
  })

  const [groupData, setGroupData] = useState({})
  const [chatData, setChatData] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [chatId, setChatId] = useState("")
  const [blocked, setBlocked] = useState(false)
  const [isMute, setIsMute] = useState(false)
  const [noData, setNoData] = useState(false)
  const [chatModalState, setChatModalState] = useState(false)
  const [modalStates, setModalStates] = useState({
    reportModalState: false,
    createPollModal: false,
    votersModal: false,
    deleteModal: false
  })
  const [myInfo, setMyInfo] = useState()
  const [loader, setLoader] = useState(true)

  const prevState = useRef()
  const bottomRef = useRef()

  const fetchChatContent = () => {
    // prevState.current = chatData
    if (chatType === "user") {
      fetchApi(GET_INDIVIDUAL_CHAT_IN, { userid: id }, false, token)
        .then((res) => {
          setLoader(false)
          if (res.data.massage.length === 0) {
            setNoData(true)
          }
          if (res.data.status_code === 200) {
            if (prevState.current && prevState.current.length !== 0) {
              if (prevState.current[prevState.current.length - 1].datetime !== res.data.massage[res.data.massage.length - 1].datetime) {
                bottomRef.current.scrollIntoView(/*{ behavior: 'smooth' }*/)
                prevState.current = res.data.message
                setChatData(res.data.massage)
              }
            }
            else {
              bottomRef.current.scrollIntoView(/*{ behavior: 'smooth' }*/)
              setChatData(res.data.massage)
            }
            setMyInfo(res.data.user_info[0])
            setChatId(res.data.chat_id)
            if (res.data.Block) {
              let checkIfBlocked = res.data.Block.some(item => (item[0]?.userid === id || item[0]?.blocker === id))
              setBlocked(checkIfBlocked)
            }
            else {
              setBlocked(false)
            }
            setIsMute(res.data.Mute)
          }
        })
    }
    else {
      fetchApi(GET_GROUP_CHAT_IN, { groupid: id }, false, token)
        .then((res) => {
          setLoader(false)
          if (res.data?.data?.length === 0) {
            setNoData(true)
          }
          if (res.data.status_code === 200) {
            setChatData(res.data.data)
          }
        })
      fetchApi(GET_GROUP_INFO, { groupid: id }, false, token)
        .then((res) => {
          setLoader(false)
          if (res.data.status_code === 200) {
            setGroupData(res.data)
          }
        })
    }
  }

  // both
  const sendChat = (e) => {
    e.preventDefault()
    if (!chatInput) return
    setChatInput("")
    if (chatType === "user") {
      fetchApi(SEND_INDIVIDUAL_CHAT, {
        type: "text",
        userid: id,
        msg: chatInput
      }, false, token)
        .then((res) => {
          if (res.data.status_code === 200) {
            fetchChatContent()
          }
        })
    }
    else {
      fetchApi(SEND_CHAT_GROUP, {
        type: "text",
        groupid: id,
        msg: chatInput
      }, false, token)
        .then((res) => {
          if (res.data.status_code === 200) {
            fetchChatContent()
          }
        })
    }
  }

  const sendPoll = (data) => {
    let sendingData = {
      type: "poll",
      groupid: id,
      poll_title: data.question,
      poll_dis: "unknown",
      end_time: data.endTime,
      multi: data.multiple,
      public: data.publicPoll,
      option1: data.options[0].option,
      option2: data.options[1].option,
    }
    if (data.options[2]) sendingData.option3 = data.options[2].option
    if (data.options[3]) sendingData.option4 = data.options[3].option
    fetchApi(CREATE_POLL, sendingData, false, token)
      .then((res) => {
        fetchChatContent()
        setModalStates({
          ...modalStates,
          createPollModal: false
        })
      })
  }

  // both
  const likeChat = (numberid, chatid) => {
    if (chatType === "user") {
      let cloneChtas = [...chatData]
      const findChatIndex = chatData.findIndex(item => item.ids === numberid)
      let cloneObject = { ...chatData[findChatIndex] }
      if (cloneObject.like_number === 1) {
        cloneObject.like_number -= 1
      }
      else {
        cloneObject.like_number += 1
      }
      cloneChtas[findChatIndex] = cloneObject
      setChatData(cloneChtas)
      fetchApi(LIKE_INDIVIDUAL_CHAT, { chatid: chatId, numberid }, false, token)
        .then(() => {
          fetchChatContent()
        })
    }
    else {
      fetchApi(LIKE_CHAT_GROUP, { chatid }, false, token)
        .then(() => {
          fetchChatContent()
        })
    }
  }

  // both
  const deleteCoversation = () => {
    if (chatType === "user") {
      fetchApi(DELETE_CHAT, { chatid: chatId }, false, token)
        .then(() => {
          toast.success("Chat deleted", { duration: 1500 })
          setTimeout(() => {
            navigate(-1)
          }, 1500)
        })
    }
    else {
      dispatch(setPageLoader(true))
      fetchApi(DELETE_GROUP, { groupid: id }, false, token)
        .then((res) => {
          dispatch(setPageLoader(false))
          toast.success("Group deleted", { duration: 1500 })
            setTimeout(() => {
              navigate(-1)
            }, 1500)
        })
    }
  }

  // individual
  const reportChat = () => {

  }

  // individual
  const blockUser = () => {
    if (!blocked) {
      setBlocked(true)
      fetchApi(BLOCK_USER, { userid: id }, false, token)
        .then((res) => {
          console.log(res);
        })
    }
    else {
      setBlocked(false)
      fetchApi(UNBLOCK_USER, { userid: id }, false, token)
        .then((res) => {
          console.log(res);
        })
    }
  }

  const handleVoteForPoll = (voteData, messageData) => {
    fetchApi(VOTE_POLL, { pollid: messageData._id, ids: voteData, groupid: id }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          fetchChatContent()
        }
      })
  }

  const changeVote = (data) => {
    fetchApi(CHANGE_VOTE, { pollid: data._id, groupid: id, ids: data.voteinfo.ids }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          fetchChatContent()
        }
        else if (res.data.status_code === 400) {
          toast.error(res.data.description)
        }
      })
  }

  const naviagteToUserProfile = (id) => {
    if (id === myUserId) {
      navigate("/profile")
    }
    else {
      navigate(`/profiles/${id}`)
    }
  }

  let checkForUpdates = ""
  useEffect(() => {
    dispatch(setFooterState(false))
    fetchChatContent()
    checkForUpdates = setInterval(() => {
      fetchChatContent()
    }, 5000)
    return () => {
      clearInterval(checkForUpdates)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      bottomRef?.current?.scrollIntoView(/*{ behavior: 'smooth' }*/)
    }, 1000)
  }, [])

  useEffect(() => {
    prevState.current = chatData
    // if (chatData.length !== 0) {
    //   if (chatData[chatData.length - 1].datetime !== prevState.current[prevState.current.length - 1].datetime) {
    //     bottomRef.current.scrollIntoView(/*{ behavior: 'smooth' }*/)
    //   }
    // }
  }, [chatData])

  return (
    <div className='chatInside'>
      {
        chatModalState &&
        <Modal
          titlesWithFunctions={
            chatType === "user" ?
              [
                { title: "Delete conversation", func: deleteCoversation },
                { title: "Report", func: () => setModalStates({ ...modalStates, reportModalState: true }) },
                { title: blocked ? "UnBlock" : "Block", func: blockUser },
                // { title: isMute ? "UnMute" : "Mute", func: muteChat }
              ]
              :
              groupData?.owner ?
              [
                { title: "Create event", func: () => navigate(`/group/${id}/events`) },
                { title: "Create poll", func: () => setModalStates({ ...modalStates, createPollModal: true }) },
                { title: "Delete group", func: () => setModalStates({ ...modalStates, deleteModal: true }) },
                // { title: isMute ? "UnMute" : "Mute", func: muteChat }
              ]
              :
              [
                { title: "Create event", func: () => navigate(`/group/${id}/events`) },
                { title: "Create poll", func: () => setModalStates({ ...modalStates, createPollModal: true }) },
                // { title: isMute ? "UnMute" : "Mute", func: muteChat }
              ]

          }
          cancelCallback={() => setChatModalState(false)}
        />
      }
      {
        modalStates.reportModalState ?
          <ReportConcern
            id={id}
            type={'user'}
            isBlocked={blocked}
            refetchHandler={fetchChatContent}
            cancelClickHandler={() => setModalStates({
              ...modalStates,
              reportModalState: false
            })}
          />
          : null
      }
      {
        modalStates.createPollModal ?
          <CreatePoll
            callbackRequest={sendPoll}
            cancelCallback={() => setModalStates({
              ...modalStates,
              createPollModal: false
            })}
          />
          : null
      }
      {
        modalStates.votersModal ?
          <VotersModal
            groupid={id}
            pollid={chatId}
            closer={() => setModalStates({ ...modalStates, votersModal: false })}
          />
          : null
      }
      {
        modalStates.deleteModal ?
          <UpModal
            question={"Are you sure you want to delete this group?"}
            yesClickHandler={deleteCoversation}
            yesContent={'Yes'}
            noContent={'No'}
            noClickHandler={() => setModalStates({ ...modalStates, deleteModal: false })}
          />
          : null
      }
      <AppBar
        innerText={otherData.name}
        hasOption
        navigateTo={-1}
        image={otherData.img}
        chatType={chatType}
        optionClickHandler={() => setChatModalState(true)}
      />
      <div className="chatContainer">
        {
          chatData?.length !== 0
            ? chatData?.map((item, index) => {
              return <ChatInCard
                key={index}
                type={chatType}
                msgData={item}
                myMsg={/* the key differes from individual */ chatType === "user" ? item.sender === myUserId : item.userid === myUserId}
                isPoll={item?.data_poll}
                senderInfo={
                  chatType === "user" ?
                    (
                      item?.sender === myUserId ? myInfo
                        : otherData
                    )
                    : ""
                }
                chatSenderClickHandler={() => {
                  if (chatType === "user") {
                    naviagteToUserProfile(item.sender)
                  }
                  else {
                    naviagteToUserProfile(item.userid)
                  }
                }}
                onVote={handleVoteForPoll}
                likeClickHandler={() => {
                  if (chatType === "user") {
                    likeChat(item.ids)
                  }
                  else {
                    likeChat("", item._id)
                  }
                }}
                openVotes={() => {
                  if (item.data_poll.public) {
                    setChatId(item._id)
                    setModalStates({
                      ...modalStates,
                      votersModal: true
                    })
                  }
                }}
                handleChangeVote={changeVote}
              />
            })
            : noData ? <div className="noData"><p>Write your message to start a conversation</p></div>
              : ""
        }
        {
          loader ?
            <Lottie
              animationData={blueLoader}
              play
              loop
              style={{ width: "100%", height: "120px" }}
            />
            : null
        }
        <br /><br /><br />
        <div ref={bottomRef} />
      </div>
      <InputField value={chatInput} onChangeHandler={(e) => setChatInput(e.target.value)} handleSubmit={sendChat} isBlocked={blocked} />
    </div>
  )
}

export default ChatIn
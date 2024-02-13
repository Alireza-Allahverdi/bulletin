import { useState, useEffect, lazy, Suspense, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import ChatCard from '../../components/cards/ChatCard'
import SearchBar from '../../components/serachBar/SearchBar'
import { setChatType, setOtherUserData } from '../../redux/chat/chatAction'
import { changeFooterOption, setFooterState } from '../../redux/footer/footerActions'
import * as blueLoader from "../../assets/gifs/instead-btn-loader.json"
import Lottie from 'react-lottie-player'

const ComposeMessageModal = lazy(() => import("./components/ComposeMessageModal"))

function Chats() {

    const GET_INDIVIDUAL_CHAT = "api/get/chat/my_chat"
    // const GET_GROUP_CHAT = "api/get/chat/my_group"
    const GET_GROUP_CHAT = "api/get/user/self_group"

    const navigate = useNavigate()

    const [individualData, setIndividualData] = useState([])
    const [filteredIndividualData, setFilteredIndividualData] = useState([])
    const [individualChatState, setIndividualChatState] = useState(true)
    const [noDataIndividual, setNoDataIndividual] = useState(false)
    // group chats
    const [groupData, setGroupData] = useState([])
    const [filteredGroupData, setFilteredGroupData] = useState([])
    const [noDataGroup, setNoDataGroup] = useState(false)
    const [memberData, setMemberData] = useState([])
    const [composeMessageModalState, setComposeMessageModalState] = useState(false)
    // search 
    const [searchInput, setSearchInput] = useState("")

    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()

    const fetchIndividualChats = () => {
        fetchApi(GET_INDIVIDUAL_CHAT, "", false, token)
            .then((res) => {
                if (res.data?.data.length === 0) {
                    setNoDataIndividual(true)
                }
                setIndividualData(res.data.data)
                setFilteredIndividualData(res.data.data)
                // setFilteredIndividualData(res.data.data)
            })
            .catch(() => setNoDataIndividual(true))
    }

    const fetchGroupChats = () => {
        fetchApi(GET_GROUP_CHAT, "", false, token)
            .then((res) => {
                if (res.data.gp_info.length === 0) {
                    setNoDataGroup(true)
                }
                setGroupData(res.data.gp_info)
                setFilteredGroupData(res.data.gp_info)
                setMemberData(res.data.member_info)
            })
            .catch(() => {
                setNoDataGroup(true)
            })
    }

    const navigateToChat = (data) => {
        if (individualChatState) {
            dispatch(setOtherUserData({
                name: `${data?.user_info[0].frist_name} ${data?.user_info[0].last_name}`,
                img: data?.user_info[0]?.img
            }))
            dispatch(setChatType("user"))
            navigate(`${data.user_info[0]._id}`)
        }
        else {
            dispatch(setOtherUserData({
                name: `${data?.group_title}`,
                img: data.image
            }))
            dispatch(setChatType("group"))
            navigate(`${data._id}`)
        }
    }

    // let checkForUpdates = null
    const intervalRef = useRef(null)
    useEffect(() => {
        dispatch(setFooterState(true))
        dispatch(changeFooterOption("chat"))
        fetchIndividualChats()
        fetchGroupChats()
        const checkForUpdates = () => {
            fetchIndividualChats()
            fetchGroupChats()
        }
        intervalRef.current = setInterval(checkForUpdates, 5000)
        return () => {
            clearInterval(intervalRef.current)
        }
    }, [])

    const searchChats = (search) => {
        // the issues with search must be solved
        setSearchInput(search)
        let foundIndividuals = []
        let foundGroups = []
        if (!search || search === null) {
            setFilteredGroupData(groupData)
            setFilteredIndividualData(individualData)
            return
        }
        foundIndividuals = individualData.filter(item => `${item.user_info[0].frist_name} ${item.user_info[0].last_name}`.toLowerCase().includes(search))
        foundGroups = groupData.filter(item => item.group_title.toLowerCase().includes(search))
        if (foundIndividuals.length === 0) {
            setNoDataIndividual(true)
        }
        if (foundGroups.length === 0) {
            setNoDataGroup(true)
        }
        setFilteredIndividualData(foundIndividuals)
        setFilteredGroupData(foundGroups)
        clearInterval(intervalRef.current)
    }

    return (
        <div className='chatsPageConatiner'>
            <Suspense>
                {
                    composeMessageModalState ?
                        <ComposeMessageModal closeModal={() => setComposeMessageModalState(false)} />
                        : null
                }
            </Suspense>
            <SearchBar placeHolder={"Search chats"} searchHandler={searchChats} onChangeSearch />
            <div className="chatTabs">
                <div className={`individualChats ${individualChatState ? "individualActive" : ""}`} onClick={() => setIndividualChatState(true)}>
                    <Icon icon="ci:user" />
                </div>
                <div className={`groupChats ${!individualChatState ? "groupActive" : ""} `} onClick={() => setIndividualChatState(false)}>
                    <Icon icon="nimbus:user-group" />
                </div>
            </div>
            <p className='chatsNotice'>{`Your ${individualChatState ? "Individual" : "Group"} Chats`}</p>
            <div className="chatCardsContainer">
                {
                    individualChatState ?
                        (
                            // individualData.length !== 0 ?
                            filteredIndividualData.length !== 0 ?
                                // individualData.map((item, index) => {
                                filteredIndividualData.map((item, index) => {
                                    return <ChatCard
                                        key={index}
                                        data={item}
                                        cardClickHandler={() => navigateToChat(item)}
                                        isIndividual
                                    />
                                })
                                :
                                noDataIndividual ?
                                    <p className="noData">Nothing Here</p>
                                    : <Lottie
                                        animationData={blueLoader}
                                        play
                                        loop
                                        style={{ width: "100%", height: "120px" }}
                                    />
                        )
                        : null
                }
                {
                    !individualChatState ?
                        (
                            // groupData.length !== 0 ?
                            filteredGroupData.length !== 0 ?
                                // groupData.map((item, index) => {
                                filteredGroupData.map((item, index) => {
                                    return <ChatCard
                                        key={index}
                                        data={item}
                                        lastMessage={memberData[index]?.Last_pm.length !== 0 ? memberData[index]?.Last_pm[0].time : ""}
                                        cardClickHandler={() => navigateToChat(item)}
                                    />
                                })
                                : noDataGroup ? <p className="noData">Nothing Here</p>
                                    : <Lottie
                                        animationData={blueLoader}
                                        play
                                        loop
                                        style={{ width: "100%", height: "120px" }}
                                    />
                        )
                        : null
                }
            </div>
            {
                individualChatState ?
                    (
                        composeMessageModalState ? ""
                            :
                            <div className="composeMessageIcon">
                                <button onClick={() => setComposeMessageModalState(true)}>
                                    <Icon icon="mdi:pencil" />
                                </button>
                            </div>
                    )
                    : null
            }
            <br /><br /><br />
        </div>
    )
}

export default Chats
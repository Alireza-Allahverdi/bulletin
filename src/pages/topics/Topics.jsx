import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import LoaderSkelet from '../../components/loaders/LoaderSkelet'
import SearchBar from '../../components/serachBar/SearchBar'
import NewTopic from './components/NewTopic'
import GroupDocCard from '../../components/cards/GroupDocCard'
import { setFooterState } from '../../redux/footer/footerActions'
import * as buttonLoader from "../../assets/gifs/instead-btn-loader.json"
import * as emptyGif from "../../assets/gifs/shake-a-empty-box.json"
import Lottie from 'react-lottie-player'
import { useMutation, useQuery } from '@tanstack/react-query'
import DocumentComp from '../../components/activityCards/DocumentComp'
import Modal from '../../components/modal/Modal'

function Topics() {

    const GET_TOPICS = "api/get/user/gp_top"
    const CREATE_TOPIC = "api/topic/user/create"
    const DELETE_TOPIC = "api/topic/user/delete"
    const LIKE_TOPIC = "api/topic/user/like"

    const token = useSelector(state => state.auth.token)
    const myUserId = useSelector(state => state.profile.id)
    const dispatch = useDispatch()

    const { id } = useParams()
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [newTopicModalState, setNewTopicModalState] = useState(false)
    const [isAdminOrOwner, setIsAdminOrOwner] = useState(false)
    const [chosenId, setChosenId] = useState(0)
    const [confirmModal, setConfirmModal] = useState(false)
    const [newTopicLoader, setNewTopicLoader] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [noData, setNoData] = useState(false)

    const fetchData = async (search) => {
        const result = await fetchApi(GET_TOPICS, { groupid: id, search }, false, token)
        if (result.data.gp_info[0].creator === myUserId) {
            setIsAdminOrOwner(true)
        }
        if (result.data.data.length === 0) {
            setNoData(true)
        }
        else {
            setNoData(false)
        }
        return result.data
    }

    const {
        isLoading,
        data,
        mutate,
        isError,
    } = useMutation({
        mutationFn: (searchText) => fetchData(searchText),
        mutationKey: ['topics']
    })

    const likeTopic = (topid) => {
        setChosenId(topid)
        fetchApi(LIKE_TOPIC, { topid }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    mutate(searchInput)
                }
            })
    }

    const deleteTopic = () => {
        fetchApi(DELETE_TOPIC, { topid: chosenId }, false, token)
            .then((res) => {
                mutate(searchInput)
            })
    }

    const createNewTopic = (data) => {
        setNewTopicLoader(true)
        fetchApi(CREATE_TOPIC, {
            groupid: id,
            title: data.title,
            dis: data.info
        }, false, token)
            .then((res) => {
                setNewTopicLoader(false)
                setNewTopicModalState(false)
                if (res.data.status_code === 200) {
                    mutate("")
                }
            })
    }

    const handleSearch = (text) => {
        setSearchInput(text)
        setTimeout(() => {
            mutate(text)
        }, 500)
    }

    useEffect(() => {
        dispatch(setFooterState(true))
        mutate('')
    }, [])

    useEffect(() => {
        let findAdmin = []
        if (data) {
            findAdmin = data?.group_admins.filter(item => item.admin === myUserId)
        }
        if (findAdmin.length !== 0) {
            setIsAdminOrOwner(true)
        }
    }, [data])

    return (
        <div className='topicsPage'>
            {
                newTopicModalState &&
                <NewTopic
                    groupName={data?.gp_info[0]?.group_title}
                    onCreate={createNewTopic}
                    closeModal={() => setNewTopicModalState(false)}
                    loader={newTopicLoader}
                />
            }
            {
                confirmModal &&
                <Modal
                    titlesWithFunctions={[
                        { title: "Confirm Removal", func: deleteTopic }
                    ]}
                    cancelCallback={() => setConfirmModal(false)}
                />
            }
            <SearchBar placeHolder={"Search Topic"} searchHandler={handleSearch} onChangeSearch />
            <div className="topicPageContent">
                <h3>{data?.gp_info[0]?.group_title}</h3>
                <p className='newTopic' onClick={() => setNewTopicModalState(true)}>Create a new topic</p>
                <br />
                {
                    isError ? null :
                        isLoading ? <LoaderSkelet loadingLines={5} />
                            :
                            data?.data.map((item, index) => (
                                <DocumentComp
                                    key={index}
                                    id={item._id}
                                    text={item.title}
                                    userInfo={item.user_info}
                                    time={item.time}
                                    likeCount={item.like_number}
                                    isTopic
                                    isEdit={isAdminOrOwner || item.creator === myUserId}
                                    loader={isLoading && chosenId === item._id}
                                    removeClickHandler={() => {
                                        setChosenId(item._id)
                                        setConfirmModal(true)
                                    }}
                                    onLike={likeTopic}
                                    cardClickHandler={() => navigate(item._id)}
                                />
                                // <GroupDocCard
                                //     key={index}
                                //     data={item}
                                //     onMoreDataClick={() => navigate(`${item._id}?_cb=1`)}
                                //     isCreatorOrAdmin={(myUserId === item.creator || isAdminOrOwner) ? true : false}
                                //     onLike={likeTopic}
                                //     onDelete={deleteTopic}
                                //     loader={isRefetching && chosenId === item._id}
                                // />
                            ))
                }
                {
                    noData &&
                    <div className="noDataGif">
                        <Lottie
                            animationData={emptyGif}
                            play
                            loop
                        />
                        no topics are found in this group
                    </div>
                }
                {
                    isLoading && <Lottie
                        play
                        loop
                        animationData={buttonLoader}
                        style={{ height: '50px', width: "80px" }}
                    />
                }
            </div>
            <br /><br />
        </div>
    )
}

export default Topics
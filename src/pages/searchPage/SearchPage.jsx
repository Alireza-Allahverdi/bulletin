import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import AppBar from "../../components/appBar/AppBar";
import SearchBar from "../../components/serachBar/SearchBar";
import { fetchApi } from "../../api/FetchApi";
import { setFooterState } from "../../redux/footer/footerActions";
import MainCards from "../../components/cards/MainCard";
import { Fragment } from "react";
import NoteComp from "../../components/activityCards/NoteComp";
import DocumentComp from "../../components/activityCards/DocumentComp";
import { useNavigate } from "react-router";
import EventComp from "../../components/activityCards/EventComp";
import { toast } from "react-hot-toast";
import { setChatType, setOtherUserData } from "../../redux/chat/chatAction";
import { setPageLoader } from "../../redux/loaders/loaderActions";

function SearchPage() {

    const SEARCH_GLOBAL = "api/user/search/user/and/group"
    const SEARCH_INSIDE_GROUP = "api/user/search/group"
    const JOIN_GROUP = "api/user/jl/group/join"

    const navigate = useNavigate()

    const { token, searchData, myUserId } = useSelector((state) => {
        return {
            token: state.auth.token,
            searchData: state.search,
            myUserId: state.profile.id
        }
    })
    const dispatch = useDispatch()

    const [data, setData] = useState()

    const gotoUserProfile = (data) => {
        if (data?.hide_status && data?._id !== myUserId) {
            return toast.error("This user has hidden his account")
        }
        if (data?._id === myUserId) {
            navigate(`/profile`)
        }
        else {
            navigate(`/profiles/${data?._id}`)
        }
    }

    const handleSearch = () => {
        if (searchData.searchType === "global") {
            fetchApi(SEARCH_GLOBAL, { search: searchData.searchInput }, false, token)
                .then((res) => {
                    setData(res?.data)
                })
        }
        else if (searchData.searchType === "group") {
            fetchApi(SEARCH_INSIDE_GROUP, { search: searchData.searchInput, groupid: searchData.groupId }, false, token)
                .then((res) => {
                    setData(res?.data)
                })
        }
    }

    const navigateToChat = (info) => {
        let data = {
            name: `${info.frist_name} ${info.last_name}`,
            img: info.image
        }
        dispatch(setChatType("user"))
        dispatch(setOtherUserData(data))
        navigate(`/chats/${info._id}`)
    }

    const joinGroup = (id) => {
        dispatch(setPageLoader(true))
        fetchApi(JOIN_GROUP, { groupid: id }, false, token)
            .then((res) => {
                dispatch(setPageLoader(false))
                if (res.data.status_code === 200) {
                    navigate(`/group/${id}`)
                }
            })
            .catch(() => {
                dispatch(setPageLoader(false))
                toast.error("Something went wrong!")
            })
    }

    useEffect(() => {
        dispatch(setFooterState(false))
        handleSearch()
    }, [])

    return (
        <div>
            <AppBar innerText={searchData.searchInput} navigateTo={-1} />
            {/* <SearchBar placeHolder={`Search ${searchData.searchType === "global" ? "groups and users" : "members, notes, etc"}`} searchHandler={handleSearch} /> */}
            <div className="searchContent">
                {
                    searchData.searchType === "global" ?
                        (
                            <Fragment>
                                <div className="resultSection">
                                    <p className="title">Users</p>
                                    {
                                        data?.user?.map((item, index) => (
                                            <div className="resultColumn" key={index}>
                                                <MainCards
                                                    key={index}
                                                    titleText={`${item.frist_name} ${item.last_name}`}
                                                    image={item.img}
                                                    customizeButton={[
                                                        item._id !== myUserId &&
                                                        {
                                                            icon: "material-symbols:chat-bubble-outline-rounded",
                                                            func: () => navigateToChat(item),
                                                            color: "black"
                                                        },
                                                    ]}
                                                    cardPicClickHandler={() => gotoUserProfile(item)}
                                                    customizeStyle={{ margin: '10px 0' }}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="resultSection">
                                    <p className="title">Groups</p>
                                    {
                                        data?.group[0]?.map((item, index) => (
                                            <div className="resultColumn" key={index}>
                                                <MainCards
                                                    noButton={data?.joined.some(dataItem => dataItem.group === item._id)}
                                                    buttonInnerText={"Join"}
                                                    titleText={item.group_title}
                                                    image={item?.image}
                                                    onButtonClick={() => {
                                                        joinGroup(item._id)
                                                    }}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            </Fragment>
                        )
                        :
                        (
                            <Fragment>
                                <div className="resultSection">
                                    <p className="title">Members</p>
                                    {
                                        data?.user.map((item, index) => (
                                            <div className="resultRow" key={index}>
                                                <MainCards
                                                    titleText={`${item.frist_name} ${item.last_name}`}
                                                    image={item.image}
                                                    customizeButton={[
                                                        item._id !== myUserId &&
                                                        {
                                                            icon: "material-symbols:chat-bubble-outline-rounded",
                                                            func: () => navigateToChat(item),
                                                            color: "black"
                                                        },
                                                    ]}
                                                    cardPicClickHandler={() => gotoUserProfile(item)}
                                                    customizeStyle={{ margin: '10px 0' }}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="resultSection">
                                    <p className="title">Notes</p>
                                    {
                                        data?.note.map((item, index) => (
                                            <div className="resultRow" key={index}>
                                                <NoteComp
                                                    bgc={item.color}
                                                    text={item.title}
                                                    noteClickHandler={() => navigate(`/group/${item.groupid}/notes/${item._id}`)}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="resultSection">
                                    <p className="title">Events</p>
                                    {
                                        data?.event.map((item, index) => (
                                            <div className="resultRow" key={index}>
                                                <EventComp
                                                    key={index}
                                                    data={item}
                                                    cardClickHandler={() => navigate(`/group/${item.groupid}/events/${item._id}`)}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="resultSection">
                                    <p className="title">Documents</p>
                                    <div className="doc">
                                        {
                                            data?.document?.map((item, index) => (
                                                <div className="resultRow" key={index}>
                                                    <DocumentComp
                                                        key={index}
                                                        text={item.title}
                                                        time={item.time}
                                                        downloadLink={item.link}
                                                        isDoc
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="resultSection">
                                    <p className="title">Topics</p>
                                    {
                                        data?.topic?.map((item, index) => (
                                            <div className="resultColumn" key={index}>
                                                <DocumentComp
                                                    key={index}
                                                    text={item.title}
                                                    userInfo={[item?.user_info]}
                                                    time={item.time}
                                                    isTopic
                                                    cardClickHandler={() => navigate(`/group/${searchData.groupId}/topics/${item._id}`)}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            </Fragment>
                        )
                }
            </div>
        </div>
    )
}

export default SearchPage
import React, { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import SearchBar from '../../components/serachBar/SearchBar'
import { changeFooterOption, setFooterState } from '../../redux/footer/footerActions'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import bulletinImg from "../../assets/images/bulletinfilled.png"
import { Link } from 'react-router-dom'
import NoteComp from "../../components/activityCards/NoteComp"
import EventComp from "../../components/activityCards/EventComp"
import DocumentComp from "../../components/activityCards/DocumentComp"
import Modal from '../../components/modal/Modal'
import UpModal from '../../components/modal/UpModal'
import ReportConcern from '../../components/modal/ReportConcern'
import ImageCropModal from '../../components/imageCropModal/ImageCropModal'
import { setSearchData } from '../../redux/search/searchAction'

function GroupHome() {

  const GET_GROUP_INFO = "api/user/group/get"
  const GET_TOPICS = "api/get/user/gp_top"
  // groupid , userid
  const DELETE_GROUP = "api/user/group/delete"
  const GET_ADMIN = "api/get/user/group_admin" // groupid
  const MUTE_GROUP = "api/mute/group" // groupid , status
  // edit actions
  const EDIT_GROUP = "api/user/group/edit" // group_title / dis/ image/ business/inst , groupid
  const DELETE_NOTE = "api/note/user/delete" // noteid
  const DELETE_TOPIC = "api/topic/user/delete" // topid
  const DELETE_DOCUMENT = "api/user/delete/doc" // docid
  const DELETE_EVENT = "api/event/user/delete" // eventid
  const UPLOAD_PHOTO = "user/img/s3"

  let { id } = useParams()
  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const imageRef = useRef()

  const [data, setData] = useState({})
  const [topicData, setTopicData] = useState([])
  const [admin, setAdmin] = useState(false)
  const [owner, setOwner] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [modalState, setModalState] = useState(false)
  const [reportAConcernModalState, setReportAConcernModalState] = useState(false)
  const [leaveGroupModalState, setLeaveGroupModalState] = useState(false)
  // edit group
  const [chosenId, setChosenId] = useState([])
  const [confirmRemovalModal, setConfirmRemovalModal] = useState(false)
  const [clickedTitle, setClickedTitle] = useState(false)
  const [clickedDis, setClickedDis] = useState()
  const [cropImageModalState, setCropImageModalState] = useState(false)
  const [imageForModal, setImageForModal] = useState("")

  const fetchGroupData = () => {
    dispatch(setPageLoader(true))
    fetchApi(GET_GROUP_INFO, { groupid: id }, false, token)
      .then((res) => {
        dispatch(setPageLoader(false))
        if (res.data.status_code === 200) {
          setData(res.data.data[0])
          setOwner(res.data.owner)
          setAdmin(res.data.admin)
        }
      })
    fetchApi(GET_TOPICS, { groupid: id, search: '' }, false, token)
      .then((res) => {
        setTopicData(res.data.data)
      })
  }

  const handleDeletingStuff = () => {
    dispatch(setPageLoader(true))
    if (chosenId[0] === "note") {
      fetchApi(DELETE_NOTE, { noteid: chosenId[1] }, false, token)
        .then(() => {
          fetchGroupData()
        })
    }
    else if (chosenId[0] === "doc") {
      fetchApi(DELETE_DOCUMENT, { docid: chosenId[1] }, false, token)
        .then(() => {
          fetchGroupData()
        })
    }
    else if (chosenId[0] === "event") {
      fetchApi(DELETE_EVENT, { eventid: chosenId[1] }, false, token)
        .then(() => {
          fetchGroupData()
        })
    }
    else if (chosenId[0] === "topic") {
      fetchApi(DELETE_TOPIC, { topid: chosenId[1] }, false, token)
        .then(() => {
          fetchGroupData()
        })
    }
  }

  const editGroupData = () => {
    // fetchGroupData()
    fetchApi(EDIT_GROUP, {
      groupid: id,
      group_title: data.group_title,
      dis: data.dis,
      image: data.image,
      inst: data.institutional,
      business: data.business,
    }, false, token)
      .then((res) => {
        console.log(res);
      })
    setEditMode(false)
    dispatch(setFooterState(true))
    setClickedDis(false)
    setClickedTitle(false)
  }

  const leaveGroup = () => {

  }

  const navigateToSetting = () => {
    navigate("setting")
  }

  const changeImageForModal = (e) => {
    setImageForModal(e.target.files[0])
    setCropImageModalState(true)
  }

  const uploadGroupImage = (file) => {
    dispatch(setPageLoader(true))
    let formData = new FormData()
    formData.append("file", file)
    fetchApi(UPLOAD_PHOTO, formData, true)
      .then((res) => {
        dispatch(setPageLoader(false))
        setData({
          ...data,
          image: res.data.link
        })
      })
  }

  const muteAndUnmuteGroup = () => {
    fetchApi(MUTE_GROUP, {
      groupid: id,
      status: !data.mute
    }, false, token)
      .then(() => {
        fetchGroupData()
      })
  }

  const navigateToSearchPage = (search) => {
    dispatch(setSearchData({
      type: "group",
      search,
      groupId: id
    }))
    navigate("/search")
  }

  useEffect(() => {
    dispatch(setFooterState(true))
    dispatch(changeFooterOption("home"))
    fetchGroupData()
    fetchApi(GET_ADMIN, { groupid: id, search: "" }, false, token)
      .then((res) => {
        console.log(res);
      })
  }, [])

  return (
    <div className='groupHome'>
      {
        modalState &&
        <Modal
          titlesWithFunctions={
            admin || owner ?
              [
                { title: "Leave Group", func: () => setLeaveGroupModalState(true) },
                { title: "Report a concern", func: () => setReportAConcernModalState(true) }
              ]
              :
              [
                { title: "Leave Group", func: () => setLeaveGroupModalState(true) }
              ]
          }
          cancelCallback={() => setModalState(false)}
        />
      }
      {
        leaveGroupModalState &&
        <UpModal
          question={owner ? "You need to assign an owner from the group members before leaving." : "Are you sure you want to leave the group?"}
          noClickHandler={() => setLeaveGroupModalState(false)}
          noContent={"Cancel"}
          yesContent={"Ok"}
          yesClickHandler={!owner ? leaveGroup : navigateToSetting}
        />
      }
      {
        reportAConcernModalState && <ReportConcern id={id} type={'group'} cancelClickHandler={() => setReportAConcernModalState(false)} />
      }
      {
        cropImageModalState && <ImageCropModal imageSrc={imageForModal} handleCroppedImage={uploadGroupImage} modalCloser={() => setCropImageModalState(false)} />
      }
      {
        (editMode && confirmRemovalModal) ?
          <Modal
            titlesWithFunctions={[
              { title: "Confirm Removal", func: handleDeletingStuff }
            ]}
            cancelCallback={() => setConfirmRemovalModal(false)}
          />
          : null
      }
      <SearchBar placeHolder={"Search members, notes, etc."} searchHandler={navigateToSearchPage} />
      <div className="groupContent">
        {
          data?.image ?
            <div className="groupImageContainer">
              <img src={data.image} alt={data.image} />
            </div>
            : null
        }
        <h2 className="groupTitle" onClick={() => setClickedTitle(true)}>
          {
            editMode && clickedTitle ?
              <input
                type="text"
                value={data.group_title}
                onChange={(e) => setData({
                  ...data,
                  group_title: e.target.value
                })}
              />
              :
              data?.group_title
          }
        </h2>
        <div className="groupActions">
          <div className="left">
            <span onClick={() => navigate(`members`)}>{data?.member_count} members</span>
            <Icon icon="mdi:user-circle-outline" onClick={() => navigate(`members`)} />
            {
              !editMode ? ""
                :
                <Icon icon="material-symbols:upload-rounded" onClick={() => imageRef.current.click()} />
            }
            <input type="file" ref={imageRef} style={{ display: "none" }} onChange={changeImageForModal} />
          </div>
          <div className="right">
            {
              editMode ? ""
                :
                <Icon icon="mdi:flag-variant" onClick={() => setModalState(true)} />
            }
            {
              (owner || admin) &&
                !editMode ?
                <>
                  <Icon icon="ant-design:setting-outlined" onClick={() => navigate(`setting`)} />
                  <Icon
                    icon="akar-icons:pencil"
                    onClick={() => {
                      setEditMode(true)
                      dispatch(setFooterState(false))
                    }}
                  />
                </>
                : editMode && <button className='editCompleteBtn' onClick={editGroupData}>Done</button>
            }
          </div>
        </div>
        <p className='sectionHeader'>
          <span>
            <Icon icon="tabler:calendar-event" />
            Events
          </span>
          <Link to={"events"}>See all</Link>
        </p>
        <div className="documentSection">
          {
            data?.events?.length !== 0 ?
              data.events?.slice(0, 2).map((item, index) => {
                return <EventComp
                  key={index}
                  data={item}
                  isEdit={editMode}
                  cardClickHandler={() => {
                    if (editMode) return
                    navigate(`events/${item._id}`)
                  }}
                  removeClickHandler={() => {
                    setChosenId(["event", item._id])
                    setConfirmRemovalModal(true)
                  }}
                />
              })
              : <p className='noDataNotice'>No Event Available</p>
          }
        </div>
        <p className='sectionHeader'>
          <span>
            <Icon icon="bx:chat" />
            Topics
          </span>
          <Link to={"topics"}>See all</Link>
        </p>
        <div className="documentSection topic">
          {
            topicData?.length !== 0 ?
              topicData?.slice(0, 3).map((item, index) => {
                return <DocumentComp
                  key={index}
                  text={item.title}
                  time={item.time}
                  isEdit={editMode}
                  isTopic
                  userInfo={item.user_info}
                  cardClickHandler={() => {
                    if (editMode) return
                    navigate(`topics/${item._id}`)
                  }}
                  removeClickHandler={() => {
                    setChosenId(["topic", item._id])
                    setConfirmRemovalModal(true)
                  }}
                />
              })
              : <p className='noDataNotice'>No Topic Available</p>
          }
        </div>
        <p className='sectionHeader'>
          <img src={bulletinImg} alt="" />
          <Link to={"notes"}>See all</Link>
        </p>
        <div className="groupNoteSection">
          {
            data.notes &&
              data.notes.length !== 0 ?
              data.notes.slice(0, 8).map((note, index) => {
                return <NoteComp
                  key={index}
                  noteClickHandler={() => {
                    if (editMode) return
                    navigate(`notes/${note._id}`)
                  }}
                  bgc={note.color}
                  text={note.title}
                  isEdit={editMode}
                  removeClickHandler={() => {
                    setChosenId(["note", note._id])
                    setConfirmRemovalModal(true)
                  }}
                />
              })
              : <p className='noDataNotice'>No Note Available</p>
          }
        </div>
        <p className='sectionHeader'>
          <span>
            <Icon icon="ion:document-text-outline" />
            Documents
          </span>
          <Link to={"docs"}>See all</Link>
        </p>
        <div className="documentSection">
          {
            data?.doc?.length !== 0 ?
              data.doc?.slice(0, 3).map((item, index) => {
                return <DocumentComp
                  key={index}
                  text={item.title}
                  isEdit={editMode}
                  downloadLink={item.link}
                  isDoc
                  removeClickHandler={() => {
                    setChosenId(["doc", item._id])
                    setConfirmRemovalModal(true)
                  }}
                />
              })
              : <p className='noDataNotice'>No Documents Available</p>
          }
        </div>
        <p className='sectionHeader'>
          <span>
            <Icon icon="material-symbols:info-outline-rounded" />
            About
          </span>
        </p>
        <div className="aboutSection" onClick={() => setClickedDis(true)}>
          {editMode && clickedDis ?
            <textarea
              type="text"
              value={data.dis}
              onChange={(e) => {
                setData({
                  ...data,
                  dis: e.target.value
                })
              }}
            />
            :
            <p>{data.dis}</p>
          }
        </div>
        <br /><br /><br />
      </div>
    </div>
  )
}

export default GroupHome
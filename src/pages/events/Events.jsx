import React, { Fragment, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import LoaderSkelet from '../../components/loaders/LoaderSkelet'
import SearchBar from '../../components/serachBar/SearchBar'
import EventCard from './components/EventCard'
import NewEvent from './components/NewEvent'
import * as blueLoader from "../../assets/gifs/instead-btn-loader.json"
import * as emptyGif from "../../assets/gifs/shake-a-empty-box.json"
import SuccessfullEvent from './components/SuccessfullEvent'
import Modal from '../../components/modal/Modal'
import Lottie from 'react-lottie-player'
import EventComp from '../../components/activityCards/EventComp'
import { setFooterState } from '../../redux/footer/footerActions'

function Events() {

  const GET_GROUP_EVENTS = "api/get/user/gp_event"
  const CREATE_EVENT = "api/event/user/create"
  const DELETE_EVENT = "api/event/user/delete"

  const date2 = new Date()
  const date = new Intl.DateTimeFormat('en')
  let formattedDate = date.formatToParts()
  let todayFormat = `${formattedDate[4].value}-${formattedDate[0].value}-${formattedDate[2].value}`

  const { id } = useParams()
  const navigate = useNavigate()

  const token = useSelector(state => state.auth.token)
  const myUserId = useSelector(state => state.profile.id)
  const dispatch = useDispatch()

  const [events, setEvents] = useState()
  const [filteredEvent, setFilteredEvent] = useState()
  const [pastData, setPastData] = useState([])
  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false)
  const [createEventModal, setCreateEventModal] = useState(false)
  const [eventCreateLoader, setEventCreateLoader] = useState(false)
  const [successfullEvent, setSuccessfullEvent] = useState(false)
  const [confirmRemovalModal, setConfirmRemovalModal] = useState(false)
  const [noData, setNoData] = useState(false)
  const [chosenEventId, setChosenEventId] = useState("")
  const [searchInput, setSearchInput] = useState('')
  const [firstLoader, setFirstLoader] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)

  const fetchData = async (search='') => {
    setIsRefetching(true)
    const result = await fetchApi(GET_GROUP_EVENTS, { groupid: id,search }, false, token)
    const filteredData = result.data.data.filter(item => new Date(item.time.to) < date2)
    setPastData(filteredData)
    const amIAdmin = result.data.group_admins.filter(item => item.admin === myUserId)
    if (amIAdmin.length !== 0) {
      setIsAdminOrOwner(true)
    }
    if (result.data.gp_info[0].creator === myUserId) {
      setIsAdminOrOwner(true)
    }
    if (result.data.data.length === 0) {
      setNoData(true)
    }
    else {
      setNoData(false)
    }
    setIsRefetching(false)
    setFirstLoader(false)
    setEvents(result.data)
    setFilteredEvent(result.data.data)
  }

  const seachEvents = (search) => {
    setSearchInput(search)
    setTimeout(() => {
      fetchData(search)
    }, 500)
  }

  const createNewEvent = (data) => {
    setEventCreateLoader(true)
    fetchApi(CREATE_EVENT, {
      groupid: id,
      ...data
    }, false, token)
      .then((res) => {
        setCreateEventModal(false)
        setSuccessfullEvent(true)
        setEventCreateLoader(false)
        fetchData()
      })
  }

  const removeEvent = () => {
    fetchApi(DELETE_EVENT, { eventid: chosenEventId }, false, token)
      .then((res) => {
        fetchData(searchInput)
        // refetch()
      })
  }
  useEffect(() => {
    dispatch(setFooterState(true))
    fetchData()
  }, [])

  return (
    <div className="eventPageContainer">
      {createEventModal && <NewEvent onCreate={createNewEvent} loader={eventCreateLoader} onCancel={() => setCreateEventModal(false)} />}
      {successfullEvent && <SuccessfullEvent closeModal={() => setSuccessfullEvent(false)} />}
      {confirmRemovalModal && <Modal titlesWithFunctions={[{ title: "Confirm Removal", func: removeEvent }]} cancelCallback={() => setConfirmRemovalModal(false)} />}
      <SearchBar placeHolder={"Search Events"} searchHandler={seachEvents} onChangeSearch />
      <div className="eventPageContent">
        <h3>{events?.gp_info[0]?.group_title}</h3>
        {
          isAdminOrOwner ?
            <div className="newEventBtnContainer">
              <button onClick={() => setCreateEventModal(true)}>Create new event</button>
            </div>
            : null
        }
        {
          pastData.length !== events?.data.length ?
            <Fragment>
              <p className="title">Upcoming Events</p>
              {
                firstLoader ?
                  <LoaderSkelet loadingLines={7} />
                  :
                  filteredEvent.length !== 0 ?
                    filteredEvent.filter(item => new Date(item.time.to) > date2)
                      .map((item, index) => {
                        return <EventComp
                          key={index}
                          data={item}
                          isEdit={(item.creator === myUserId) || isAdminOrOwner}
                          removeClickHandler={() => {
                            setChosenEventId(item._id)
                            setConfirmRemovalModal(true)
                          }}
                          cardClickHandler={() => navigate(`${item._id}`)}
                        // onCardClick={}
                        // isCreatorOrAdmin={}
                        // onRemoveClick={}
                        />
                      })
                    : <div className="noData">
                      No Events were found
                    </div>
              }
            </Fragment>
            : null
        }
        {
          pastData.length !== 0 ?
            <Fragment>
              <p className="title">Past Events</p>
              {
                pastData.map((item, index) => {
                  return <EventComp
                    key={index}
                    data={item}
                    onCardClick={() => navigate(`${item._id}`)}
                    isCreatorOrAdmin={item.creator === myUserId || isAdminOrOwner}
                    onRemoveClick={() => {
                      setChosenEventId(item._id)
                      setConfirmRemovalModal(true)
                    }}
                  />
                })
              }
            </Fragment>
            : ""
        }
        {
          noData &&
          <div className="noDataGif">
            <Lottie
              animationData={emptyGif}
              play
              loop
            />
            no events have been added
          </div>
        }
        {
          isRefetching ?
            <Lottie
              animationData={blueLoader}
              play
              loop
              style={{ width: "100%", height: "100px" }}
            />
            : null
        }
      </div>
      <br /><br />
    </div>
  )
}

export default Events
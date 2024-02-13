import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import { setFooterState } from '../../redux/footer/footerActions'
import AppBar from '../../components/appBar/AppBar'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import { Icon } from '@iconify/react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from "leaflet"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

function EventOne() {

  const GET_EVENT_ONE = "api/event/user/get_one"
  const GOING = "api/event/user/going"
  const MAYBE = "api/event/user/maybe"
  const NOT_GOING = "api/event/user/not_going"

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  });

  const { eventid } = useParams()
  const navigate = useNavigate()

  const token = useSelector(state => state.auth.token)
  const myUserId = useSelector(state => state.profile.id)
  const dispatch = useDispatch()

  const [eventData, setEventData] = useState({
    map_link: {
      lat: 0,
      lng: 0
    }
  })
  const [participationState, setParticipationState] = useState("")

  const navigateToGoogleMap = () => {
    window.open(`https://maps.google.com/maps?daddr=${eventData.map_link.lat},${eventData.map_link.lng}&amp;ll=`)
  }

  const MyComponent = () => {
    const map = useMap()
    map.flyTo([eventData.map_link.lat, eventData.map_link.lng])
    return null
  }

  const getEvents = () => {
    fetchApi(GET_EVENT_ONE, { eventid }, false, token)
      .then((res) => {
        dispatch(setPageLoader(false))
        if (res.data.status_code === 200) {
          setEventData(res.data.data[0])
        }
      })
  }

  const handleEventAction = (state) => {
    setParticipationState(state)
    let chosenPlan;
    switch (state) {
      case 'going':
        chosenPlan = GOING
        break;
      case 'notGoing':
        chosenPlan = NOT_GOING
        break;
      case 'maybe':
        chosenPlan = MAYBE
        break;
      default:
        break;
    }
    fetchApi(chosenPlan, { eventid }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          getEvents()
        }
      })
  }

  useEffect(() => {
    dispatch(setFooterState(false))
    dispatch(setPageLoader(true))
    getEvents()
  }, [])

  return (
    <div className="eventOnePageContainer">
      <AppBar innerText={eventData.event_name} navigateTo={-1} />
      <div className="eventContent">
        {/* <h3>{eventData?.time?.from}</h3> */}
        <div className="eventHeader">
          <div className="eventName">
            {eventData.event_name}
          </div>
        </div>
        {
          eventData.image ?
            <img className='eventImg' src={eventData.image} alt={eventData.img} />
            : null
        }
        <div className="locationSection">
          <p className="sectionHeader">
            <Icon icon="fluent:location-28-regular" />
            <span>Location: </span>
            {
              eventData.online ?
                <span>Online</span>
                : <span>{eventData.location}</span>
            }
          </p>
          {
            eventData.online ?
              <div className="locationOnline">
                <div className="dataContainer">
                  <div className="data">
                    {eventData.location}
                  </div>
                </div>
              </div>
              : <div className="locationOffline" onClick={navigateToGoogleMap}>
                <MapContainer center={[eventData.map_link.lat, eventData.map_link.lng]} zoom={11} scrollWheelZoom={false} onClick={navigateToGoogleMap} style={{ width: "100%", height: "250px" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[eventData.map_link.lat, eventData.map_link.lng]}>
                    <Popup>
                      Event location.
                    </Popup>
                  </Marker>
                  <MyComponent />
                </MapContainer>
              </div>
          }
        </div>
        <div className="infoSection">
          <div className="sectionHeader">
            <p className='header'>
              <Icon icon="uiw:information-o" />
              <span>Information: </span>
            </p>
            <div className='desc'>
              <p>{eventData.dis}</p>
            </div>
          </div>
        </div>
        <div className="feeSection">
          <p className="sectionHeader">
            <Icon icon="ph:currency-circle-dollar" />
            <span>Fee: </span>
            <span>{eventData.dolar} $</span>
          </p>
          <div className="dataContainer">
            <div className="data">
              {eventData.paypal_email}
            </div>
          </div>
        </div>
        <div className="feeSection">
          <p className="sectionHeader">
            <span>Link for event photos / documents: </span>
          </p>
          <div className="dataContainer">
            <div className="data">
              {eventData.paypal_email}
            </div>
          </div>
        </div>
        <div className="eventOneActions">
          <div
            className="status"
            style={{ backgroundColor: (participationState === "notGoing" || eventData?.Not_going?.some(item => item === myUserId)) ? "#C95A5A" : "" }}
            onClick={() => handleEventAction("notGoing")}
          >
            <span>
              <Icon icon="iconamoon:dislike" />
              Not Going
            </span>
            <span>{eventData.Not_going?.length}</span>
          </div>
          <div
            className="status"
            style={{ backgroundColor: (participationState === "going" || eventData?.Going?.some(item => item === myUserId)) ? "#0071BC" : "" }}
            onClick={() => handleEventAction("going")}
          >
            <span>
              <Icon icon="iconamoon:like" />
              Going
            </span>
            <span>{eventData.Going?.length}</span>
          </div>
          <div
            className="status"
            style={{ backgroundColor: (participationState === "maybe" || eventData?.Maybe?.some(item => item === myUserId)) ? "#DFDC7F" : "" }}
            onClick={() => handleEventAction("maybe")}
          >
            <span>
              <Icon icon="ri:question-line" />
              Maybe
            </span>
            <span>{eventData.Maybe?.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventOne
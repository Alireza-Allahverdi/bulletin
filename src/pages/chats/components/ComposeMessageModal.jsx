import { useState } from "react"
import { fetchApi } from "../../../api/FetchApi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import MainCards from "../../../components/cards/MainCard"
import { setChatType, setOtherUserData } from "../../../redux/chat/chatAction"
import { Icon } from "@iconify/react"
import Lottie from "react-lottie-player"
import * as blueLoader from "../../../assets/gifs/loader-blue.json"
import { toast } from "react-hot-toast"

function ComposeMessageModal({ closeModal }) {

  const SEARCH_USERS = "api/user/search/user"

  const navigate = useNavigate()

  const token = useSelector(state => state.auth.token)
  const myUserId = useSelector(state => state.profile.id)
  const dispatch = useDispatch()

  const [inputField, setInputField] = useState("")
  const [usersFound, setUsersFound] = useState([])
  const [noData, setNoData] = useState(false)
  const [loader, setLoader] = useState(false)
  const [check, setCheck] = useState(false)

  const searchUsers = (e) => {
    e.preventDefault()
    if (!inputField) {
      setCheck(true)
      return
    }
    setLoader(true)
    fetchApi(SEARCH_USERS, { search: inputField }, false, token)
      .then((res) => {
        setLoader(false)
        setUsersFound(res.data.data)
        if (res.data.data.length === 0) {
          setNoData(true)
        }
        else {
          setNoData(false)
        }
      })
  }

  const navigateToUserChat = (data) => {
    if (data._id === myUserId) {
      navigate("/profile")
      return
    }
    if (data.hide_status) {
      return toast.error("This account is hidden")
    }
    dispatch(setChatType("user"))
    dispatch(setOtherUserData({
      name: `${data.frist_name} ${data.last_name}`,
      img: data.img
    }))
    navigate(data._id)
  }

  return (
    <div className="composeMessageContainer">
      <div className="composeModalSelf">
        <div className="searchArea">
          <div className="titleAndCloser">
            <span>Compose a message</span>
            <button className="closer" onClick={closeModal}>
              <Icon icon="system-uicons:cross-circle" />
            </button>
          </div>
          <form onSubmit={searchUsers}>
            <input
              type="search"
              value={inputField}
              placeholder="Search Users"
              onChange={(e) => {
                setCheck(false)
                setInputField(e.target.value)
              }}
            />
            <button type="submit">
              <Icon icon="material-symbols:search-rounded" />
            </button>
          </form>
          <p>
            {
              check && !inputField
                ? "Search Field is empty!"
                : ""
            }
          </p>
        </div>
        <div className="users">
          {
            loader ?
              (
                <Lottie
                  animationData={blueLoader}
                  play
                  loop
                  style={{ width: "100%", height: "120px" }}
                />
              )
              :
              (
                usersFound.length !== 0 ?
                  usersFound.map((user, index) => (
                    <MainCards
                      key={index}
                      image={user.img}
                      titleText={`${user.frist_name} ${user.last_name}`}
                      cardPicClickHandler={() => navigateToUserChat(user)}
                      noButton
                    />
                  ))
                  : null
              )
          }
          {
            !check && !noData && usersFound.length === 0 ?
              <div className="noData">
                <p>Search Usernames to see the results</p>
              </div>
              : null
          }
          {
            noData ?
              <div className="noData">
                <p>No users were found for the given keywords</p>
              </div>
              : null
          }
        </div>
      </div>
    </div>
  )
}

export default ComposeMessageModal
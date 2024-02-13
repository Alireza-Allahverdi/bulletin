import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import MainCards from '../../components/cards/MainCard'
import LoaderSkelet from '../../components/loaders/LoaderSkelet'
import Modal from '../../components/modal/Modal'
import SearchBar from '../../components/serachBar/SearchBar'
import { setChatType, setOtherUserData } from '../../redux/chat/chatAction'
import { changeFooterOption } from '../../redux/footer/footerActions'
import { toast } from 'react-hot-toast'

function Members() {

  const GET_MEMBERS = "api/get/user/member" // groupid
  const REMOVE_MEMBER = "api/user/group/remove_member"

  const { id } = useParams()
  const navigate = useNavigate()

  const token = useSelector(state => state.auth.token)
  const myUserId = useSelector(state => state.profile.id)
  const dispatch = useDispatch()

  const [memberData, setMemberData] = useState([])
  const [filteredMemberData, setFilteredMemberData] = useState([])
  const [admins, setAdmins] = useState([])
  const [ownerId, setOwnerId] = useState("")
  const [confirmRemovalModal, setConfirmRemovalModal] = useState(false)
  const [chosenMemberId, setChosenMemberId] = useState("")
  const [isOwner, setIsOwner] = useState(false)
  const [loader, setLoader] = useState(false)

  const getGroupMembers = () => {
    setLoader(true)
    fetchApi(GET_MEMBERS, { groupid: id }, false, token)
      .then((res) => {
        setIsOwner(res.data.Owner)
        console.log(res);
        setLoader(false)
        if (res.data.status_code === 200) {
          setOwnerId(res.data.owner_id)
          setMemberData(res.data.data)
          setFilteredMemberData(res.data.data)
          setAdmins(res.data.group_admins)
        }
      })
  }

  const deleteMember = () => {
    fetchApi(REMOVE_MEMBER, { userid: chosenMemberId, groupid: id }, false, token)
      .then((res) => {
        getGroupMembers()
      })
  }

  const gotoUserProfile = (data) => {
    if (data.member_info[0].hide_status) {
      return toast.error("This user has hidden his account")
    }
    if (data.member_info[0]?._id === myUserId) {
      navigate(`/profile`)
    }
    else {
      navigate(`/profiles/${data.user}`)
    }
  }

  const navigateToChat = (info) => {
    let data = {
      name: `${info.member_info[0].frist_name} ${info.member_info[0].last_name}`,
      img: info.member_info[0]?.img
    }
    dispatch(setChatType("user"))
    dispatch(setOtherUserData(data))
    navigate(`/chats/${info.member_info[0]?._id}`)
  }

  const handleSearch = (search) => {
    if (!search || search === "") {
      setFilteredMemberData(memberData)
      return
    }
    let foundData = memberData.filter(item => `${item.member_info[0].frist_name} ${item.member_info[0].last_name}`.includes(search))
    console.log(foundData);
    setFilteredMemberData(foundData)
  }

  useEffect(() => {
    dispatch(changeFooterOption("home"))
    getGroupMembers()
  }, [])

  return (
    <div className="memberPage">
      <SearchBar placeHolder={"Search members"} searchHandler={handleSearch} onChangeSearch />
      {
        confirmRemovalModal &&
        <Modal
          titlesWithFunctions={
            [
              { title: "Confirm removal", func: deleteMember }
            ]
          }
          cancelCallback={() => setConfirmRemovalModal(false)}
        />
      }
      <div className="memberPageContent">
        {
          loader ?
            <LoaderSkelet loadingLines={5} />
            :
            filteredMemberData.length !== 0 ?
              filteredMemberData.map((member, index) => (
                <MainCards
                  cardPicClickHandler={() => gotoUserProfile(member)}
                  key={index}
                  titleText={`${member.member_info[0]?.frist_name} ${member.member_info[0]?.last_name}`}
                  image={member.member_info[0]?.img || member.member_info[0]?.image}
                  customizeButton={
                    [
                      member.member_info[0]?._id !== myUserId &&
                      {
                        icon: "material-symbols:chat-bubble-outline-rounded",
                        func: () => navigateToChat(member),
                        color: "black"
                      },
                      member.member_info[0]?._id !== myUserId &&
                      (admins?.some(item => item._id === myUserId) || isOwner) &&
                      member.user !== ownerId &&
                      {
                        icon: "iconoir:delete-circle",
                        func: () => {
                          setChosenMemberId(member.member_info[0]?._id)
                          setConfirmRemovalModal(true)
                        },
                        color: "red"
                      }
                    ]
                  }
                />
              ))
              : ""
        }
        <br /><br />
      </div>
    </div>
  )
}

export default Members
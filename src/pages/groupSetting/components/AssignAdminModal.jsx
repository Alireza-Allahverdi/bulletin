import React, { useEffect, useState } from 'react'
import AppBar from '../../../components/appBar/AppBar'
import { useDispatch, useSelector } from 'react-redux'
import { setFooterState } from '../../../redux/footer/footerActions'
import { fetchApi } from '../../../api/FetchApi'
import MainCards from '../../../components/cards/MainCard'
import * as loader from "../../../assets/gifs/loader-blue.json"
import Lottie from 'react-lottie-player'

function AssignAdminModal({ groupName, groupid, onAssign, closer }) {

  const GET_MEMBERS = "api/get/user/member" // groupid

  const { token, myUserId } = useSelector((state) => {
    return {
      token: state.auth.token,
      myUserId: state.profile.id
    }
  })
  const dispatch = useDispatch()

  const [members, setMembers] = useState([])
  const [admins, setAdmins] = useState([])
  const [isOwner, setIsOwner] = useState(false)

  const fetchMembers = () => {
    fetchApi(GET_MEMBERS, { groupid }, false, token)
      .then((res) => {
        setMembers(res.data.data)
        setAdmins(res.data.group_admins)
        if (res.data.Owner) {
          setIsOwner(true)
        }
        // const amIAdmin = res.data.group_admins.some
        //         for (let i in res.data.group_admins) {
        // if (i.admin )
        //         }
      })
  }

  useEffect(() => {
    dispatch(setFooterState(false))
    fetchMembers()
  }, [])

  return (
    <div className="assingAdminModalContainer">
      <AppBar innerText={"Assign Admin"} onlyCall={closer} />
      <h3>{groupName}</h3>
      <p className="sectionHeader">Members</p>
      <div className="memberContent">
        {
          members.length !== 0 ?
            members.map((member, index) => {
              return <MainCards
                key={index}
                image={member?.member_info[0].img || member?.member_info[0].image}
                titleText={`${member?.member_info[0].frist_name} ${member?.member_info[0].last_name}`}
                buttonInnerText={"Select"}
                noButton={(isOwner && member.user === myUserId) || admins.some(item => item._id === member.user)}
                onButtonClick={() => onAssign(member)}
                customizeStyle={{ margin: '10px 0' }}
              />
            })
            : <Lottie animationData={loader} loop play style={{ width: "100%", height: 150 }} />
        }
      </div>
    </div>
  )
}

export default AssignAdminModal
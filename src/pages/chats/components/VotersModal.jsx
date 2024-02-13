import React, { useEffect, useState } from 'react'
import { fetchApi } from '../../../api/FetchApi'
import { useSelector } from 'react-redux'
import AppBar from '../../../components/appBar/AppBar'
import MainCards from '../../../components/cards/MainCard'
import { useNavigate } from 'react-router'

function VotersModal({ groupid, pollid, closer }) {

    const GET_PEOPLE_VOTED = "api/user/poll/voted/people" // groupid, pollid, number

    const navigate = useNavigate()

    const { token, myUserId } = useSelector(state => {
        return {
            token: state.auth.token,
            myUserId: state.profile.id
        }
    })

    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchApi(GET_PEOPLE_VOTED, { groupid, pollid, number: 1 }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    setUsers(res.data.data)
                }
            })
    }, [])


    return (
        <div className='votersModal'>
            <AppBar innerText={"Votes"} onlyCall={closer} />
            <div className="voters">
                {
                    users.map((user, index) => (
                        <MainCards
                            key={index}
                            titleText={`${user?.frist_name?.frist_name} ${user?.last_name.last_name}`}
                            noButton
                            cardPicClickHandler={() => {
                                if (user.voter === myUserId) {
                                    navigate('/profile')
                                }
                                else {
                                    navigate(`/profiles/${user.voter}`)
                                }
                            }}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default VotersModal
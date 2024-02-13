import React from 'react'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import toast from 'react-hot-toast'

function ChatInCard({ type, msgData, myMsg, senderInfo, chatSenderClickHandler, likeClickHandler, onVote, isPoll, handleChangeVote,openVotes }) {

    const [selectedVotes, setSelectedVoytes] = useState([])

    // if multi answer implemented
    const handleVoting = () => {
    }

    return (
        <div className={`chatBox ${myMsg ? "mine" : "other"}`}>
            <div className={`chatWithInfo ${myMsg ? "mine" : "other"}`}>
                <div className="senderInfo" onClick={chatSenderClickHandler}>
                    {
                        type === "user" ?
                            (
                                !myMsg ?
                                    (
                                        senderInfo.img ?
                                            <img src={senderInfo.img} alt="" />
                                            : <Icon icon="mdi:user-circle-outline" />
                                    )
                                    :
                                    (
                                        senderInfo.img ?
                                            <img src={senderInfo.img} alt="" />
                                            : <Icon icon="mdi:user-circle-outline" />
                                    )
                            )
                            :
                            (
                                msgData.user_info.img ?
                                    <img src={msgData.user_info.img} alt="" />
                                    : <Icon icon="mdi:user-circle-outline" />
                            )
                    }
                    <p>
                        {
                            type === "user" ?
                                (
                                    myMsg ?
                                        senderInfo.frist_name
                                        : senderInfo.name.substring(0, senderInfo.name.indexOf(" "))
                                )
                                : msgData.user_info.frist_name
                        }
                    </p>
                </div>
                <div className="msg">
                    {
                        !isPoll ?
                            <p>
                                {
                                    type === "user" ?
                                        msgData.ticket[0]
                                        : msgData.msg
                                }
                            </p>
                            :
                            <div className="pollMsg">
                                <div className="pollTitle">
                                    <span>{msgData.data_poll.poll_qr}</span>
                                    <span className='voteNumber' onClick={openVotes}>{msgData.data_poll.total_vote} votes</span>
                                </div>
                                <div className="pollChoices">
                                    {
                                        msgData?.data_poll?.data?.map((item, index) => (
                                            item.title !== "" ?
                                                <div className='choice' key={index}>
                                                    {
                                                        msgData.vote || new Date(msgData?.data_poll?.ending_time).getTime() < new Date().getTime() ?
                                                            <span>
                                                                {
                                                                    !isNaN(item.vote_number / msgData.data_poll.total_vote) ?
                                                                        (
                                                                            msgData.data_poll.multi ?
                                                                                (
                                                                                    (
                                                                                        item.vote_number /
                                                                                        (
                                                                                            msgData.data_poll.data[0].vote_number +
                                                                                            msgData.data_poll.data[1].vote_number +
                                                                                            msgData.data_poll.data[2].vote_number +
                                                                                            msgData.data_poll.data[3].vote_number
                                                                                        )
                                                                                    ) * 100
                                                                                ).toFixed(1)
                                                                                :
                                                                                ((item.vote_number / msgData.data_poll.total_vote) * 100).toFixed(1)
                                                                        )
                                                                        : 0
                                                                }%
                                                            </span>
                                                            :
                                                            <input
                                                                type="checkbox"
                                                                name=""
                                                                id=""
                                                                onClick={() => {
                                                                    if (msgData.data_poll.multi) {
                                                                        let cloneAnswers = [...selectedVotes]
                                                                        if (selectedVotes.includes(item.ids)) {
                                                                            cloneAnswers.splice((item.ids - 1), 1)
                                                                            setSelectedVoytes(cloneAnswers)
                                                                        }
                                                                        else {
                                                                            setSelectedVoytes([...selectedVotes, item.ids])
                                                                        }
                                                                    }
                                                                    else {
                                                                        onVote([item.ids], msgData)
                                                                    }
                                                                }}
                                                            />
                                                    }
                                                    <div className='answer'>
                                                        <span>{item.title}</span>
                                                        {
                                                            msgData.vote ?
                                                                <div className='progressContainer'>
                                                                    <div
                                                                        className='votePercentage'
                                                                        style={{
                                                                            width: `${msgData.data_poll.multi ? (
                                                                                item.vote_number /
                                                                                (
                                                                                    msgData.data_poll.data[0].vote_number +
                                                                                    msgData.data_poll.data[1].vote_number +
                                                                                    msgData.data_poll.data[2].vote_number +
                                                                                    msgData.data_poll.data[3].vote_number
                                                                                )
                                                                            ) * 100
                                                                                :
                                                                                (item.vote_number / msgData.data_poll.total_vote) * 100}%`
                                                                        }}
                                                                    />
                                                                </div>
                                                                : null
                                                        }
                                                        {/* <progress value={(item.vote_number / msgData.data_poll.total_vote)}></progress> */}
                                                    </div>
                                                </div>
                                                : null
                                        ))
                                    }
                                </div>
                                <div className="pollActionsAndTime">
                                    <p>Voting ends : {msgData.data_poll.ending_time}</p>
                                    {
                                        msgData.vote ?
                                            <button onClick={() => handleChangeVote(msgData)}>Change Vote</button>
                                            :
                                            msgData.data_poll.multi ?
                                                <button
                                                    onClick={() => {
                                                        if (selectedVotes.length === 0) return toast.error("Must Select at least one option", { duration: 2000 })
                                                        setSelectedVoytes([])
                                                        onVote(selectedVotes, msgData)
                                                    }}
                                                >Submit Vote</button>
                                                :
                                                null
                                    }
                                </div>
                            </div>
                    }
                </div>
            </div>
            <div className="likeWithCount" onClick={likeClickHandler}>
                {
                    type === "user" ?
                        (
                            msgData.like_number === 0 ?
                                <Icon icon="mdi:cards-heart-outline" />
                                : <Icon icon="mdi:cards-heart" />
                        )
                        :
                        <Icon icon="mdi:cards-heart" />
                }
                {
                    type === "user" ? ""
                        :
                        (
                            msgData.like_number < 1 ? ""
                                :
                                <span>{msgData.like_number}</span>

                        )
                }
            </div>
        </div>
    )
}

export default ChatInCard
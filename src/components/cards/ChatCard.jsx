import { Icon } from '@iconify/react'
import React from 'react'

function ChatCard({ data, isIndividual, lastMessage, cardClickHandler }) {
    return (
        <div className='chatCardConatiner' onClick={cardClickHandler}>
            <div className="cardRightSide">
                {
                    !isIndividual ?
                        (
                            data.image ?
                                <img src={data.image} alt="" />
                                : <Icon icon="ci:users-group" />
                        )
                        :
                        (
                            data?.user_info[0]?.img || data?.user_info[0]?.image ?
                                <img src={data?.user_info[0]?.img || data?.user_info[0]?.image} alt="" />
                                : <Icon icon="ri:user-3-line" />
                        )
                }
                <div className="cardContent">
                    {
                        isIndividual ?
                            <>
                                <p>{`${data?.user_info[0].frist_name} ${data?.user_info[0].last_name}`} <span>{data?.isMute && <Icon icon="ion:volume-mute-outline" />}</span></p>
                                <p>{data?.ticket[data.ticket.length - 1]?.ticket[0]}</p>
                            </>
                            :
                            <>
                                <p>{data.group_title}</p>
                                <p>{data?.member_count} members</p>
                            </>
                    }
                </div>
            </div>
            <div className="lastMessageTime">
                {
                    !data.ticket
                        ?
                        lastMessage?.slice(0, 10)
                        :
                        data?.ticket[data.ticket.length - 1]?.datetime.slice(0, 16)
                }
            </div>
        </div>
    )
}

export default ChatCard
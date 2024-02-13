import { Icon } from '@iconify/react'
import React from 'react'

function RepComCard({ time, dis, id, likeCount, userInfo, isNote, onLike }) {
    return (
        <div className='comment'>
            <div className="header">
                {
                    userInfo ?
                    <>
                    <Icon icon="mdi:user-edit" />
                            <span>{userInfo[0].frist_name} {userInfo[0].last_name}</span>
                            <span> | </span>
                        </>
                        : null
                }
                <span className='time'>{time.slice(0, 16)}</span>
                {
                    !isNote ?
                        <div className="like">
                            <Icon icon="mdi:cards-heart" className='likeIcon' onClick={() => onLike(id)} />
                            <p>{likeCount}</p>
                        </div>
                        : null
                }
            </div>
            <hr />
            <div className="dis">{dis}</div>
        </div>
    )
}

export default RepComCard
import { Icon } from '@iconify/react'
import React from 'react'

function EventCard({ data, isCreatorOrAdmin, onCardClick, onRemoveClick }) {
    return (
        <div className="eventCardComp">
            <div className="eventName" onClick={onCardClick}>{data.event_name}</div>
            <div className="eventTime" onClick={onCardClick}>{data.time.from}</div>
            <div className="eventActions">
                <span className="deleteEvent">
                    {isCreatorOrAdmin && <Icon icon="iconoir:delete-circle" onClick={() => onRemoveClick(data._id)} />}
                </span>
                <span className="participants">
                    <Icon icon="mdi:user" />
                    {data.Going}
                </span>
            </div>
        </div>
    )
}

export default EventCard
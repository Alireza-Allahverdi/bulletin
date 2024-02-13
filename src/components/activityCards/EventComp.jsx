import { Icon } from "@iconify/react"

function EventComp({ data, isEdit, removeClickHandler, cardClickHandler }) {

    let dateFormat = new Date(data.time.from)
    let extractTime = data.time.from.split(" ")[1]

    return (
        <div className="eventCard" style={{ paddingTop: isEdit && "5px", margin: '10px 0' }}>
            {
                isEdit &&
                <button onClick={removeClickHandler}>
                    <Icon icon="basil:cross-solid" />
                </button>
            }
            <Icon className="eventIcon" icon="material-symbols:event-available-rounded" onClick={cardClickHandler} />
            <p className="title" onClick={cardClickHandler}>{data.event_name}</p>
            <p className="time" onClick={cardClickHandler}>{dateFormat.toString().slice(4, 15)}</p>
            <div className="memebers" onClick={cardClickHandler}>
                <div>
                    <p>{dateFormat.toString().slice(0, 4)}</p>
                    <p>{extractTime}</p>
                </div>
                <div>
                    <Icon icon="mdi:user-multiple-add" />
                    {data.Going.length}
                </div>
            </div>
        </div>
    )
}

export default EventComp
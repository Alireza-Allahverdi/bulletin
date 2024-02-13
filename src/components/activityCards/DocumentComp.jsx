import { Icon } from "@iconify/react"
import { ClipLoader } from 'react-spinners'

function DocumentComp({ id, text, likeCount, isEdit, removeClickHandler, cardClickHandler, time, isTopic, isDoc, downloadLink, userInfo, onLike, dis, loader = false }) {
    return (
        <div className="documentCard" style={{ paddingTop: isEdit && "5px" }}>
            {
                isEdit &&
                <button onClick={removeClickHandler}>
                    <Icon icon="basil:cross-solid" />
                </button>
            }
            {
                isDoc ?
                    <div className={`downloadWrapper ${isEdit ? "editMode" : ""}`}>
                        <span onClick={() => window.open(downloadLink)}>
                            <Icon icon="solar:download-minimalistic-linear" />
                        </span>
                    </div>
                    : null
            }
            <div className={`titleWrapper ${isEdit && isTopic ? "editMode" : ""}`}>
                <span onClick={cardClickHandler}>{text}</span>
            </div>
            {
                isTopic || id ?
                    <div className="author">
                        <Icon icon="mdi:user-edit" />
                        <span>{userInfo && userInfo[0]?.frist_name} {userInfo && userInfo[0]?.last_name}</span>
                        <span>|</span>
                        {
                            time ?
                                (
                                    <>
                                        <span className="date">{time.slice(0, 17)}</span>
                                        {
                                            id ?
                                                <div className="like">
                                                    <Icon icon="mdi:cards-heart" className='likeIcon' onClick={() => onLike(id)} />
                                                    <p>
                                                        {
                                                            loader ?
                                                                <ClipLoader size={9} color="#F44336" />
                                                                :
                                                                likeCount
                                                        }
                                                    </p>
                                                </div>
                                                :
                                                <span className="time">{time.slice(17, 22)}</span>
                                        }
                                    </>
                                )
                                : null
                        }
                    </div>
                    : null
            }
            {
                dis ?
                    <>
                        <hr />
                        <div className="desc">{dis}</div>
                    </>
                    : null
            }
        </div>
    )

}

export default DocumentComp
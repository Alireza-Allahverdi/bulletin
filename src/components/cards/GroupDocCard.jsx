import { Icon } from '@iconify/react'
import Lottie from 'react-lottie-player'
import { ClipLoader } from 'react-spinners'

function GroupDocCard({ data, isCreatorOrAdmin, onLike, onMoreDataClick, isDoc, onDelete, loader }) {
    return (
        <div className='groupDocCardCont'>
            <div
                className='groupDocCreatorInfo'
                onClick={() => {
                    if (isDoc) return
                    onMoreDataClick()
                }}
            >
                {
                    data?.image ?
                        <img src={data.image} alt={data?.image} />
                        : <Icon icon="ph:user-circle" />
                }
                <p>{data?.user_info[0]?.frist_name}</p>
            </div>
            <div
                className='groupDocInfo'
                onClick={() => {
                    if (isDoc) return
                    onMoreDataClick()
                }}
            >
                <p>{data.title}</p>
                {!isDoc && <p>Click to read more</p>}
            </div>
            <div className='groupDocActions'>
                {
                    loader ?
                    <ClipLoader color="#0071BC" size={15} />
                        :
                        <>
                            {isCreatorOrAdmin && <Icon icon="iconoir:delete-circle" onClick={() => onDelete(data._id)} />}
                            <div className="likeAndCount">
                                {isDoc && <a href={data?.link} target="_blank" download><Icon icon="ic:baseline-cloud-download" color='#289D57' /></a>}
                                <div>
                                    <Icon icon="mdi:cards-heart" className='likeIcon' onClick={() => onLike(data._id)} />
                                    <p>{data.like_number}</p>
                                </div>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default GroupDocCard
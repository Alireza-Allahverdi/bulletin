import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import AppBar from '../../components/appBar/AppBar'
import { setFooterState } from '../../redux/footer/footerActions'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import Modal from '../../components/modal/Modal'
import DocumentComp from '../../components/activityCards/DocumentComp'
import RepComCard from '../../components/activityCards/RepComCard'

function TopicOne() {

  const GET_TOPIC_DATA = "api/topic/user/get_one"
  const SUBMIT_COMMENT = "api/topic/user/comment"
  const GET_COMMENTS = "api/topic/user/get_com"
  const LIKE_COMMENT = "api/topic/user/like_comment" // commentid
  const LIKE_TOPIC = "api/topic/user/like"
  const DELETE_TOPIC = "api/topic/user/delete"

  const { topicId } = useParams()
  const navigate = useNavigate()

  const token = useSelector(state => state.auth.token)
  const myUserId = useSelector(state => state.profile.id)
  const dispatch = useDispatch()

  const [topicData, setTopicData] = useState({})
  const [loader, setLoader] = useState(false)
  const [commentBoxState, setCommentBoxState] = useState(false)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState("")
  const [confirmRemovalModlaState, setConfirmRemovalModalState] = useState(false)

  const fetchData = () => {
    // dispatch(setPageLoader(true))
    setLoader(true)
    fetchApi(GET_TOPIC_DATA, { topid: topicId }, false, token)
      .then((res) => {
        setLoader(false)
        setTopicData(res.data.data[0])
      })
    fetchApi(GET_COMMENTS, { topid: topicId }, false, token)
      .then((res) => {
        setComments(res.data.data)
      })
  }

  const deleteTopic = () => {
    fetchApi(DELETE_TOPIC, { topid: topicId }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          toast.success("Topic Deleted!", { duration: 1500 })
          setTimeout(() => {
            navigate(-1)
          }, 1500)
        }
      })
  }

  const likeTopic = (topid) => {
    fetchApi(LIKE_TOPIC, { topid }, false, token)
      .then((res) => {
        fetchData()
      })
  }

  const sendComment = () => {
    if (!commentInput) return toast.error("")
    setCommentInput("")
    setCommentBoxState(false)
    fetchApi(SUBMIT_COMMENT, { topid: topicId, msg: commentInput }, false, token)
      .then((res) => {
        fetchData()
      })
  }

  const likeComment = (commentid) => {
    fetchApi(LIKE_COMMENT, { commentid }, false, token)
      .then((res) => {
        fetchData()
      })
  }

  useEffect(() => {
    dispatch(setFooterState(false))
    fetchData()
  }, [])

  return (
    <div className="oneTopicPage">
      <AppBar innerText={"Topics"} navigateTo={-1} />
      {
        confirmRemovalModlaState ?
          <Modal titlesWithFunctions={[{ title: "Confirm Removal", func: deleteTopic }]} cancelCallback={() => setConfirmRemovalModalState(false)} />
          : null
      }
      <div className="oneTopicContent">
        <div className="topic">
          <DocumentComp
            id={topicData._id}
            text={topicData?.title}
            time={topicData?.time}
            userInfo={topicData?.user_info}
            dis={topicData.description}
            likeCount={topicData.like_number}
            onLike={likeTopic}
            isTopic
            isEdit={myUserId === topicData.creator}
            loader={loader}
          />
        </div>
        <p className="commentsHeader">Comments:</p>
        {
          comments.map((comment, index) => (
            <RepComCard
              key={index}
              id={comment._id}
              dis={comment.comment}
              likeCount={comment.like_number}
              userInfo={comment.user_info}
              time={comment.time}
              onLike={likeComment}
            />
          ))
        }
      </div>
      {
        commentBoxState ?
          <div className="commentBox">
            <textarea rows="4" placeholder="Write a comment" onChange={(e) => setCommentInput(e.target.value)}></textarea>
            <button onClick={sendComment}>Post</button>
          </div>
          :
          <div className="writeCommentBtn">
            <button onClick={() => setCommentBoxState(true)}>Write a comment</button>
          </div>
      }
    </div>
  )
}

export default TopicOne
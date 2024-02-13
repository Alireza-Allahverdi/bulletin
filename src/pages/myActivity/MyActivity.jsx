import { useDispatch, useSelector } from "react-redux"
import { fetchApi } from "../../api/FetchApi"
import { useEffect } from "react"
import bulletinIcon from "../../assets/images/bulletinfilled.png"
import AppBar from "../../components/appBar/AppBar"
import { useState } from "react"
import DocumentComp from "../../components/activityCards/DocumentComp"
import { useNavigate } from "react-router"
import NoteComp from "../../components/activityCards/NoteComp"
import { setPageLoader } from "../../redux/loaders/loaderActions"
import { toast } from "react-hot-toast"
import Modal from "../../components/modal/Modal"
import { setFooterState } from "../../redux/footer/footerActions"

function MyActivity() {

  const GET_MY_ACTIVITY = "api/my/ac/created"
  const DELETE_DOCUMENT = "api/user/delete/doc" // docid
  const DELETE_TOPIC = "api/topic/user/delete" // topid
  const DELETE_NOTE = "api/note/user/delete" // noteid

  const navigate = useNavigate()

  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const [activities, setActivities] = useState()
  const [confirmRemovalModal, setConfirmRemovalModal] = useState(false)
  const [deletingType, setDeletingType] = useState("")
  const [chosenId, setChosenId] = useState("")

  const fetchActivity = () => {
    dispatch(setPageLoader(true))
    fetchApi(GET_MY_ACTIVITY, {}, false, token)
      .then((res) => {
        dispatch(setPageLoader(false))
        if (res.data.status_code === 200) {
          setActivities(res.data)
        }
      })
      .catch(() => {
        dispatch(setPageLoader(false))
        toast.error("Something went wrong")
      })
  }

  const deleteDocument = (docid) => {
    dispatch(setPageLoader(true))
    fetchApi(DELETE_DOCUMENT, { docid }, false, token)
      .then((res) => {
        dispatch(setPageLoader(false))
        fetchActivity()
      })
      .catch(() => {
        dispatch(setPageLoader(false))
        toast.error("Some thing went wrong")
      })
  }

  const deleteTopic = (topid) => {
    dispatch(setPageLoader(true))
    fetchApi(DELETE_TOPIC, { topid }, false, token)
      .then((res) => {
        fetchActivity()
      })
      .catch(() => {
        dispatch(setPageLoader(false))
        toast.error("Some thing went wrong")
      })
  }

  const deleteNote = (noteid) => {
    dispatch(setPageLoader(true))
    fetchApi(DELETE_NOTE, { noteid }, false, token)
      .then((res) => {
        fetchActivity()
      })
      .catch(() => {
        dispatch(setPageLoader(false))
        toast.error("Some thing went wrong")
      })
  }

  useEffect(() => {
    dispatch(setFooterState(false))
    fetchActivity()
  }, [])

  return (
    <div>
      <AppBar innerText={"My Activity"} navigateTo={-1} />
      {
        confirmRemovalModal ?
          <Modal
            titlesWithFunctions={[
              {
                title: "Confirm removal", func: () => {
                  if (deletingType === "doc") {
                    deleteDocument(chosenId)
                  }
                  else if (deletingType === "topic") {
                    deleteTopic(chosenId)
                  }
                  else {
                    deleteNote(chosenId)
                  }
                }
              }
            ]}
            cancelCallback={() => setConfirmRemovalModal(false)}
          />
          : null
      }
      <div className="myActivityContent">
        <p className="Sectionheader">My documents</p>
        <div className="dataContainer">
          {
            activities?.document[0].map((doc, index) => (
              <DocumentComp
                key={index}
                text={doc.title}
                isDoc
                isEdit
                cardClickHandler={() => navigate(`/group/${doc.groupid}/docs`)}
                removeClickHandler={() => {
                  setConfirmRemovalModal(true)
                  setDeletingType("doc")
                  setChosenId(doc._id)
                  // deleteDocument(doc._id)
                }}
              />
            ))
          }
        </div>
        <p className="Sectionheader">My topics</p>
        <div className="dataContainer">
          {
            activities?.topics[0].map((topic, index) => (
              <DocumentComp
                key={index}
                text={topic.title}
                isEdit
                cardClickHandler={() => navigate(`/group/${topic.groupid}/topics/${topic._id}`)}
                removeClickHandler={() => {
                  setConfirmRemovalModal(true)
                  setDeletingType("topic")
                  setChosenId(topic._id)
                  // deleteTopic(topic._id)
                }}
              />
            ))
          }
        </div>
        <img src={bulletinIcon} alt="" className="icon" />
        <div className="dataContainer">
          {
            activities?.notes[0].map((note, index) => (
              <NoteComp
                key={index}
                bgc={note.color}
                text={note.title}
                isEdit
                noteClickHandler={() => navigate(`/group/${note.groupid}/notes/${note._id}`)}
                removeClickHandler={() => {
                  setConfirmRemovalModal(true)
                  setDeletingType("note")
                  setChosenId(note._id)
                  // deleteNote(note._id)
                }}
              />
            ))
          }
        </div>
      </div>
      {/* <br /><br /> */}
    </div>
  )
}

export default MyActivity
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import ButtonComp from '../../components/button/ButtonComp'
import Modal from '../../components/modal/Modal'
import SearchBar from '../../components/serachBar/SearchBar'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import NewNote from './components/NewNote'
import Lottie from 'react-lottie-player'
import * as emptyGif from "../../assets/gifs/shake-a-empty-box.json"
import * as loaderGif from "../../assets/gifs/instead-btn-loader.json"
import NoteComp from '../../components/activityCards/NoteComp'
import { useRef } from 'react'

function Notes() {

  const GET_GROUP_NOTES = "api/get/user/gp_note" // filter: All ,Last Month, Last Week, Today, number
  const CREATE_NOTE = "api/note/user/create"
  const DELETE_NOTE = "api/note/user/delete"

  const { id } = useParams()
  const navigate = useNavigate()

  const { token, myUserId } = useSelector((state) => {
    return {
      token: state.auth.token,
      myUserId: state.profile.id
    }
  })
  const dispatch = useDispatch()

  const ref = useRef()

  const [data, setData] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [newNoteModal, setNewNoteModal] = useState(false)
  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false)
  const [chosenId, setChosenId] = useState("")
  const [fetchLoader, setFetchLoader] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [searchInput, setSearchInput] = useState('')
  const [confirmRemoveModal, setConfirmRemoveModal] = useState(false)
  const [noData, setNoData] = useState(false)

  const fetchData = (page, filter = "All", search = "") => {
    fetchApi(GET_GROUP_NOTES, { groupid: id, filter, number: page, search }, false, token)
      .then((res) => {
        dispatch(setPageLoader(false))
        setFetchLoader(false)
        // dispatch(setPageLoader(false))
        console.log(res);
        if (res.data.status_code === 200) {
          setData(res.data)
          if (res.data.gp_info[0].creator === myUserId) {
            setIsAdminOrOwner(true)
          }
          if (res.data.data.length === 0) {
            setNoData(true)
          }
        }
      })
  }

  const createNote = (data) => {
    dispatch(setPageLoader(true))
    fetchApi(CREATE_NOTE, {
      groupid: id,
      title: data.title,
      note: data.note,
      color: data.color,
      time: data.expireDate
    }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          setNewNoteModal(false)
          fetchData(1)
        }
      }).catch(() => {
        dispatch(setPageLoader(false))
      })
  }

  const removeNote = (noteid) => {
    fetchApi(DELETE_NOTE, { noteid }, false, token)
      .then((res) => {
        console.log(res);
        setConfirmRemoveModal(false)
        if (res.data.status_code === 200) {
          fetchData(1, selectedFilter, searchInput)
        }
      })
  }

  const onFilterChange = (e) => {
    setFetchLoader(true)
    setSelectedFilter(e.target.value)
    fetchData(1, `${e.target.value}`, searchInput)
  }

  const handleSearch = (text) => {
    ref.current = text
    setSearchInput(text)
  }

  useEffect(() => {
    dispatch(setPageLoader(false))
    fetchData(1)
  }, [])

  useEffect(() => {
    let findAdmin = []
    if (data) {
      findAdmin = data?.group_admins.filter(item => item.admin === myUserId)
    }
    if (findAdmin.length !== 0) {
      setIsAdminOrOwner(true)
    }
    console.log(data);
  }, [data])

  useEffect(() => {
    setTimeout(() => {
      if (ref.current === searchInput) {
        fetchData(1, selectedFilter, searchInput)
      }
    }, 500);
  }, [searchInput])

  return (
    <div className="groupNoteContainer">
      <SearchBar placeHolder={"Search Note"} searchHandler={handleSearch} onChangeSearch />
      {newNoteModal && <NewNote groupName={data?.gp_info[0]?.group_title} modalCloser={() => setNewNoteModal(false)} onCreate={createNote} />}
      {confirmRemoveModal && <Modal titlesWithFunctions={[{ title: "Confirm Removal", func: () => removeNote(chosenId) }]} cancelCallback={() => setConfirmRemoveModal(false)} />}
      <h3>{data?.gp_info[0]?.group_title}</h3>
      <div className="groupNoteContent">
        <p className="bulletin">Bulletin</p>
        <div className="filterNotes">
          <p>Filter</p>
          <select onChange={onFilterChange}>
            <option value="All">All</option>
            <option value="Last Month">Last month</option>
            <option value="Last Week">Last week</option>
            <option value="Today">Today</option>
          </select>
        </div>
        <div className="notesContainer">
          {
            fetchLoader ?
              <div className="loader">
                <Lottie
                  animationData={loaderGif}
                  play
                  loop
                />
              </div>
              : null
          }
          {
            data?.data.length !== 0 ?
              data?.data.map((item) => {
                return <NoteComp
                  key={item._id}
                  bgc={item.color}
                  text={item.title}
                  noteText={item.note}
                  isEdit={item.creator === myUserId || isAdminOrOwner}
                  noteClickHandler={() => navigate(`${item._id}`)}
                  removeClickHandler={() => {
                    setConfirmRemoveModal(true)
                    setChosenId(item._id)
                  }}
                />
              })
              : !noData
                ? <Lottie
                  animationData={loaderGif}
                  play
                  loop
                  style={{ width: "100%", height: "200px" }}
                />
                : <div className="noDataGif">
                  <Lottie
                    animationData={emptyGif}
                    play
                    loop
                  />
                  There are no notes in this group
                </div>
          }
        </div>
        <div className="notePost">
          <ButtonComp innerText={"Post a note"} light onClickHandler={() => setNewNoteModal(true)} />
        </div>
      </div>
    </div>
  )
}

export default Notes
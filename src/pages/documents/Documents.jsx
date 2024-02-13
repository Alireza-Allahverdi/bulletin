import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchApi } from '../../api/FetchApi';
import SearchBar from '../../components/serachBar/SearchBar';
import LoaderSkelet from '../../components/loaders/LoaderSkelet';
import GroupDocCard from '../../components/cards/GroupDocCard';
import NewDoc from './components/NewDoc';
import Lottie from 'react-lottie-player';
import * as buttonLoader from "../../assets/gifs/instead-btn-loader.json"
import * as emptyGif from "../../assets/gifs/shake-a-empty-box.json"
import { setPageLoader } from '../../redux/loaders/loaderActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import DocumentComp from '../../components/activityCards/DocumentComp';
import Modal from '../../components/modal/Modal';
import { useRef } from 'react';

function Documents() {

  const GET_GROUP_DOCS = "api/get/user/gp_doc"
  const CREATE_DOCUMENT = "api/create/doc"
  const DELETE_DOCUMENT = "api/user/delete/doc" // docid
  const LIKE_DOCUMENT = "api/user/like/doc" //docid

  const ref = useRef()

  const { id } = useParams()

  const { token, myUserId } = useSelector((state) => {
    return {
      token: state.auth.token,
      myUserId: state.profile.id
    }
  })
  const dispatch = useDispatch()

  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false)
  const [shareDocModal, setShareDocModal] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [loader, setLoader] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [chosenId, setChosenId] = useState(0)
  const [noData, setNoData] = useState(false)

  const fetchDocs = async (search = "") => {
    const result = await fetchApi(GET_GROUP_DOCS, { groupid: id, search }, false, token)
    if (result.data.gp_info[0].creator === myUserId) {
      setIsAdminOrOwner(true)
    }
    if (result.data.data.length === 0) {
      setNoData(true)
    }
    else {
      setNoData(false)
    }
    return result.data
  }

  const {
    isLoading,
    data,
    mutate,
    isError,
  } = useMutation({
    mutationKey: ['docs'],
    mutationFn: (data) => fetchDocs(data),
    keepPreviousData: true
  });

  const likeDoc = (id) => {
    setChosenId(id)
    fetchApi(LIKE_DOCUMENT, { docid: id }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          mutate(searchInput)
        }
      })
  }

  const deleteDoc = () => {
    fetchApi(DELETE_DOCUMENT, { docid: chosenId }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          mutate(searchInput)
        }
      })
  }

  const createDocument = (data) => {
    setLoader(true)
    fetchApi(CREATE_DOCUMENT, {
      groupid: id,
      title: data.title,
      link: data.docLink
    }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          mutate('')
          setLoader(false)
          setShareDocModal(false)
        }
      })
  }

  const handleSearch = (search) => {
    ref.current = search
    setSearchInput(search)
  }

  useEffect(() => {
    mutate('')
  }, [])

  useEffect(() => {
    dispatch(setPageLoader(false))
    let findAdmin = []
    if (data) {
      findAdmin = data?.group_admins.filter(item => item.admin === myUserId)
    }
    if (findAdmin.length !== 0) {
      setIsAdminOrOwner(true)
    }
  }, [data])

  useEffect(() => {
    setTimeout(() => {
      if (ref.current === searchInput) {
        mutate(searchInput)
      }
    }, 500);
  }, [searchInput])

  return (
    <div className="documentsPage">
      {
        shareDocModal &&
        <NewDoc loader={loader} groupName={data?.gp_info[0].group_title} closeModal={() => setShareDocModal(false)} onCreate={createDocument} />
      }
      {
        confirmModal &&
        <Modal
          titlesWithFunctions={[
            { title: "Confirm Removal", func: deleteDoc }
          ]}
          cancelCallback={() => setConfirmModal(false)}
        />
      }
      <SearchBar placeHolder={"Search documents"} searchHandler={handleSearch} onChangeSearch />
      <div className="documentPageContent">
        <h3>{data?.gp_info[0].group_title}</h3>
        {
          // isLoading
          //   ? <LoaderSkelet loadingLines={5} />
          //   :
          data?.data.length !== 0
            ? <>
              <p className="groupDocHeader">Documents</p>
              {
                data?.data.map((item, index) => (
                  <DocumentComp
                    key={index}
                    id={item._id}
                    text={item.title}
                    downloadLink={item.link}
                    likeCount={item.like_number}
                    time={item.time}
                    userInfo={item.user_info}
                    isDoc
                    isEdit={isAdminOrOwner || item.creator === myUserId}
                    onLike={likeDoc}
                    removeClickHandler={() => {
                      setChosenId(item._id)
                      setConfirmModal(true)
                    }}
                    loader={isLoading && item._id === chosenId}
                  />
                  // <GroupDocCard
                  //   key={index}
                  //   data={item}
                  //   onLike={likeDoc}
                  //   isCreatorOrAdmin={isAdminOrOwner || item.creator === myUserId}
                  //   onDelete={deleteDoc}
                  //   loader={isRefetching && item._id === chosenId}
                  //   isDoc
                  // />
                ))
              }
            </>
            : isError && <p>There was an error loading data</p>
        }
        {
          noData && <div className="noDataGif">
            <Lottie
              animationData={emptyGif}
              play
              loop
            />
            No documents can be found in this group
          </div>
        }
        {
          isLoading && <Lottie
            play
            loop
            animationData={buttonLoader}
            style={{ height: '50px', width: "80px" }}
          />
        }
      </div>
      <div className="newDocButton">
        <button className="newDocButton" onClick={() => setShareDocModal(true)}>Share Document</button>
      </div>
      <br /><br /><br />
    </div>
  )
}

export default Documents
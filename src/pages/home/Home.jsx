import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/serachBar/SearchBar'
import Slider from "./components/Slider"
import ButtonComp from '../../components/button/ButtonComp'
import MainCards from '../../components/cards/MainCard'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { changeFooterOption, setFooterState } from '../../redux/footer/footerActions'
import { fetchApi } from '../../api/FetchApi'
import LoaderSkelet from '../../components/loaders/LoaderSkelet'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import { toast } from 'react-hot-toast'
import { setUserId } from '../../redux/profile/profileActions'
import * as ghost from "../../assets/gifs/123936-empty-ghost.json"
import Lottie from 'react-lottie-player'
import { setSearchData } from '../../redux/search/searchAction'

function Home() {

  const GET_MY_PROFILE = "api/profile/myprofile"
  const GET_DISCOVER = "api/get/user/group"
  const GET_USER_GROUPS = "api/get/user/self_group"
  const JOIN_GROUP = "api/user/jl/group/join"

  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  
  let navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [discover, setDiscover] = useState([])
  const [noGroup, setNoGroup] = useState(false)
  const [noDiscover, setNoDiscover] = useState(false)

  const fetchProfile = () => {
    fetchApi(GET_MY_PROFILE, "", false, token)
      .then((res) => {
        dispatch(setUserId(res.data.data[0]._id))
      })
  }

  const fetchDiscover = (page) => {
    fetchApi(GET_DISCOVER, { number: page, search: ''}, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          setDiscover(res.data.data)
          if (res.data.data.length === 0) {
            setNoDiscover(true)
          }
        }
      })
      .catch(() => {
        setNoDiscover(true)
      })
  }

  const fetchUserGroups = () => {
    fetchApi(GET_USER_GROUPS, "", false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          setGroups(res.data.gp_info)
          if (res.data.gp_info.length === 0) {
            setNoGroup(true)
          }
        }
      })
      .catch(() => {
        setNoGroup(true)
      })
  }

  const joinGroup = (id) => {
    fetchApi(JOIN_GROUP, { groupid: id }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          navigate(`/group/${id}`)
        }
      })
  }

  const navigateToSearchPage = (search) => {
    dispatch(setSearchData({
      type: "global",
      search
    }))
    navigate("/search")
  }

  useEffect(() => {
    dispatch(setPageLoader(false))
    dispatch(setFooterState(true))
    dispatch(changeFooterOption("home"))
    fetchProfile()
    fetchUserGroups()
    fetchDiscover(1)
  }, [])

  return (
    <div className='homePageContainer'>
      <SearchBar placeHolder={"Search groups and users"} searchHandler={navigateToSearchPage} />
      <Slider />
      <div className="newGroupCont">
        <ButtonComp width={264} innerText={"Start a new group"} onClickHandler={() => navigate("/newgroup")} />
      </div>
      <div className="userGroupsSection">
        <div className="sectionTitleContainer">
          <p>Your groups</p>
          <Link to={"/groups"}>See all</Link>
        </div>
        {
          groups.length !== 0 ?
            groups.slice(0, 3).map((item, index) => (
              <div className='eachCard' key={index}>
                <Link to={`/group/${item._id}`}>
                  <MainCards noButton titleText={item.group_title} image={item?.image} underTitleText={item?.member_count} />
                </Link>
              </div>
            ))
            : <div className="noData">
              {
                !noGroup ?
                  <p className='skeletonLoaderContainer'>
                    <LoaderSkelet loadingLines={3} />
                  </p>
                  :
                  <div>
                    <Lottie
                      play
                      loop
                      animationData={ghost}
                      style={{ height: '150px', width: '100%' }}
                    />
                    <p>You haven't joined to any groups yet</p>
                  </div>
              }
            </div>
        }
      </div>
      <div className="discoverSection">
        <div className="sectionTitleContainer">
          <p>Discover</p>
          <Link to={"/discover"}>See all</Link>
        </div>
        {
          discover &&
            discover.length !== 0 ?
            discover.slice(0, 4).map((item, index) => (
              <div className='eachCard' key={index}>
                <MainCards
                  buttonInnerText={"Join"}
                  titleText={item.group_title}
                  underTitleText={item.member_count}
                  image={item?.image}
                  onButtonClick={() => {
                    if (item.limit > item.member_count) {
                      joinGroup(item._id)
                    }
                    else {
                      toast.error("Group Join limit is reached")
                    }
                  }}
                />
              </div>
            ))
            : <div className="noData">
              {
                !noDiscover ?
                  <p className="skeletonLoaderContainer">
                    <LoaderSkelet loadingLines={4} />
                  </p>
                  :
                  <div>
                    <Lottie
                      play
                      loop
                      animationData={ghost}
                      style={{ height: '150px', width: '100%' }}
                    />
                    <p>Nothing here</p>
                  </div>
              }
            </div>
        }
        <br /><br /><br />
      </div>
    </div>
  )
}

export default Home
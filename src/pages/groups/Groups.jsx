import SearchBar from '../../components/serachBar/SearchBar'
import LoaderSkelet from '../../components/loaders/LoaderSkelet';
import MainCards from '../../components/cards/MainCard';
import { fetchApi } from '../../api/FetchApi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFooterState } from '../../redux/footer/footerActions';
import { useNavigate } from 'react-router-dom';
import { setPageLoader } from '../../redux/loaders/loaderActions';
import * as ghost from "../../assets/gifs/123936-empty-ghost.json"
import Lottie from 'react-lottie-player';
import { useQuery } from '@tanstack/react-query';

function Groups() {

  const GET_USER_GROUPS = "api/get/user/self_group"
  const LEAVE_GROUP = "api/user/jl/group/left"

  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [filteredData, setFilteredData] = useState([])

  const fetchData = async () => {
    let result = await fetchApi(GET_USER_GROUPS, "", false, token)
    console.log(result.data);
    return result.data
  }

  const {
    data,
    error,
    isError,
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchData,
    keepPreviousData: true
  })

  const leaveGroup = (id) => {
    dispatch(setPageLoader(true))
    fetchApi(LEAVE_GROUP, { groupid: id }, false, token)
      .then((res) => {
        if (res.data.status_code === 200) {
          refetch()
        }
      })
  }

  const navigateToGroupHome = (id) => {
    navigate(`/group/${id}`)
  }

  const searchGroups = (search) => {
    if (!search) {
      setFilteredData(data.gp_info)
      return
    }
    let cloneData = [...filteredData]
    let cloneDataFiltered = cloneData.filter(item => item.group_title.includes(search))
    setFilteredData(cloneDataFiltered)
  }

  useEffect(() => {
    dispatch(setFooterState(true))
  }, [])

  useEffect(() => {
    if (isRefetching) {
      dispatch(setPageLoader(true))
    }
    else {
      dispatch(setPageLoader(false))
    }
  }, [isRefetching])

  useEffect(() => {
    setFilteredData(data?.gp_info)
    console.log(data)
  }, [data])

  return (
    <div className='userGroupsPage'>
      <SearchBar placeHolder={"Search groups"} searchHandler={searchGroups} onChangeSearch />
      <div className="userGroupsDataContainer">
        <div className="sectionTitleContainer">
          <p>Groups</p>
        </div>
        <div className="userGroupsData">
          {
            data &&
              data?.gp_info.length === 0 ?
              <>
                <Lottie
                  play
                  loop
                  animationData={ghost}
                  style={{ height: '150px', width: '100%' }}
                />
                <p style={{ textAlign: "center", fontWeight: "700" }}>There is nothing here</p>
              </>
              :
              isLoading ?
                <p className='skeletonLoaderContainer'>
                  <LoaderSkelet loadingLines={6} />
                </p>
                :
                // data?.gp_info.length !== 0 &&
                // data?.gp_info.map((item, index) => (
                filteredData?.length !== 0 &&
                filteredData?.map((item, index) => (
                  <div className="eachCard" key={index}>
                    <MainCards
                      cardPicClickHandler={() => navigateToGroupHome(item._id)}
                      buttonInnerText={"Leave"}
                      titleText={item.group_title}
                      underTitleText={item.member_count}
                      image={item.image}
                      buttonLight
                      onButtonClick={() => leaveGroup(item._id)}
                      noButton={item.owner}
                    />
                  </div>
                ))
          }
        </div>
        <br /><br /><br />
      </div>

    </div>
  )
}

export default Groups
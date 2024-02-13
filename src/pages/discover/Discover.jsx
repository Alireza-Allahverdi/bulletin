import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApi } from '../../api/FetchApi'
import * as ghost from "../../assets/gifs/123936-empty-ghost.json"
import ButtonComp from '../../components/button/ButtonComp'
import MainCards from '../../components/cards/MainCard'
import InputComp from '../../components/inputs/InputComp'
import LoaderSkelet from '../../components/loaders/LoaderSkelet'
import SearchBar from '../../components/serachBar/SearchBar'
import { setFooterState, changeFooterOption } from '../../redux/footer/footerActions'
import * as nextPageLoader from "../../assets/gifs/loader-blue.json"
import { useNavigate } from 'react-router'
import Lottie from 'react-lottie-player'
import { useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { setPageLoader } from '../../redux/loaders/loaderActions'

function Discover() {

    let EMAIL_PATTERN = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    const VERIFY_INSTITUTIONAL_EMAIL = "api/user/send/institutional/email"
    const GET_GROUPS = "api/get/user/group"
    const JOIN_GROUP = "api/user/jl/group/join"

    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()

    const [institutionalEmail, setInstitutionalEmail] = useState('')
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')

    const navigate = useNavigate()

    const fetchData = async ({ pageParam }) => {
        const result = await fetchApi(GET_GROUPS, { number: pageParam.page, search: pageParam.search }, false, token)
        setMaxPage(result.data.max_page)
        return result.data
    }

    const {
        isError,
        data: groups,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        refetch: refetchGroups
    } = useInfiniteQuery({
        queryKey: ["groups"],
        queryFn: (data) => {
            if (data.pageParam) {
                return fetchData({ pageParam: { page: data.pageParam.page, search: searchInput } })
            }
            return fetchData({ pageParam: { page: 1, search: searchInput } })
        },
        // keepPreviousData: true,
        staleTime: 10000,
        cacheTime: Infinity,
        getNextPageParam: (lastPage, allPages) => {
            if (allPages.length === maxPage) {
                return
            }
        }
    })

    const verifyInstitutionalEmail = () => {
        if (!EMAIL_PATTERN.test(institutionalEmail)) return toast.error("Email is not valid!!", { duration: 2000 })
        dispatch(setPageLoader(true))
        fetchApi(VERIFY_INSTITUTIONAL_EMAIL, { email: institutionalEmail }, false, token)
            .then((res) => {
                dispatch(setPageLoader(false))
                if (res.data.status_code === 200) {
                    toast.success("Verification Email has been sent to your email", { duration: 3000 })
                    setInstitutionalEmail('')
                }
                else if (res.data.status_code === 403) {
                    toast.error(res.data.description, { duration: 3000 })
                }
            })
    }

    const searchGroups = (search) => {
        setSearchInput(search)
    }

    const handleScrool = (e) => {
        e.preventDefault()
        if (groups.pages.length === maxPage) return
        if (!isFetchingNextPage) {
            const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 200;
            if (bottom && page < maxPage) {
                let nextPage = page + 1
                setPage(nextPage)
                fetchNextPage({ pageParam: { page: nextPage, search: searchInput } })
            }
        }
    }

    const joinGroup = (groupid) => {
        fetchApi(JOIN_GROUP, { groupid }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    navigate(`/group/${groupid}`)
                }
            })
    }

    useEffect(() => {
        dispatch(setFooterState(true))
        dispatch(changeFooterOption("home"))
    }, [])

    useEffect(() => {
        if (searchInput) {
            refetchGroups()
        }
    }, [searchInput])

    return (
        <div className="discoverPage" onScroll={handleScrool}>
            <SearchBar placeHolder={"Search group and users"} searchHandler={searchGroups} />
            <div className="discoverPageTop">
                <p className="discoverDescription">
                    join clubs within your institution
                    by verifying your institution email
                </p>
                <InputComp inputType={"email"} value={institutionalEmail} placeHolder={"Enter email address"} onChangeHandler={(e) => setInstitutionalEmail(e.target.value)} />
                <ButtonComp innerText={"Verify institution email"} light={true} onClickHandler={verifyInstitutionalEmail} />
            </div>
            <div className="discoverDataContainer">
                <div className="sectionTitleContainer">
                    <p>Discover</p>
                </div>
                <div className="discoverData">
                    {
                        isError ?
                            <>
                                <Lottie
                                    play
                                    loop
                                    animationData={ghost}
                                    style={{ height: '150px', width: '100%' }}
                                />
                                <p style={{ textAlign: "center" }}>There is nothing here</p>
                            </>
                            :
                            isLoading ?
                                <p className='skeletonLoaderContainer'>
                                    <LoaderSkelet loadingLines={4} />
                                </p>
                                :
                                groups?.pages.map((page) => (
                                    page.data.map((item, index) => {
                                        return <div className='eachCard' key={index}>
                                            <MainCards
                                                buttonInnerText={"Join"}
                                                titleText={item.group_title}
                                                image={item?.image}
                                                underTitleText={item.member_count}
                                                buttonLight
                                                onButtonClick={() => joinGroup(item._id)}
                                            />
                                        </div>
                                    })
                                ))
                    }

                </div>
                {
                    isFetchingNextPage &&
                    <Lottie
                        play
                        loop
                        animationData={nextPageLoader}
                        style={{ height: '80px', width: '100%' }}
                    />

                }
                {/* <button onClick={() => {
                    fetchNextPage()
                    setPage(prevState => prevState + 1)
                }}>load more</button> */}
                <br /><br /><br />
            </div>
        </div>
    )
}

export default Discover
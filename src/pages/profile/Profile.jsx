import React, { useEffect, useRef, useState, Fragment } from 'react'
import { Icon } from '@iconify/react'
import Compressor from 'compressorjs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import InfoCard from '../../components/cards/InfoCard'
import EditModal from './EditModal'
import ImageCropModal from '../../components/imageCropModal/ImageCropModal'
import 'react-image-crop/dist/ReactCrop.css';
import ModalImage from "react-modal-image";
import Modal from '../../components/modal/Modal'
import ReportConcern from '../../components/modal/ReportConcern'
import { changeFooterOption, setFooterState } from '../../redux/footer/footerActions'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import { setChatType, setOtherUserData } from '../../redux/chat/chatAction'
import { toast } from 'react-hot-toast'

function Profile() {

    const GET_MY_PROFILE = "api/profile/myprofile"
    const UPLOAD_PHOTO = "user/img/s3"
    const EDIT_PROFILE = "user/edit/profile"
    const GET_OTHER_PROFILE = "api/profile/account" // id
    const BLOCK_USER = "api/chat/one/block"
    const UNBLOCK_USER = "api/chat/one/unblock"

    const { id } = useParams()

    let imageUploadRef = useRef()
    let photoGalleryUploadRef = useRef()

    let navigate = useNavigate()

    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()

    const [profile, setProfile] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [openImageModal, setImageOpenModal] = useState(false)
    const [imageForModal, setImageForModal] = useState("")
    const [activeCard, setActiveCard] = useState({
        university: false,
        work: false,
        info: false,
        skill: false,
        interest: false,
        hobby: false
    })
    const [openArrayCardsModal, setOpenArrayCardsModal] = useState(false)
    // other user
    const [otherUserFlagModal, setOtherUserFlagModal] = useState(false)
    const [reportAConcernModal, setReportAConcernModal] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)

    const fetchUserProfile = () => {
        dispatch(setPageLoader(true))
        if (id) {
            fetchApi(GET_OTHER_PROFILE, { id }, false, token)
                .then((res) => {
                    dispatch(setPageLoader(false))
                    setIsBlocked(res.data.data[0].blocked.length === 0 ? false : true)
                    setProfile(res.data.data[0])
                })
                .catch(() => {
                    dispatch(setPageLoader(false))
                    toast.error("something went wrong!")
                })
        }
        else {
            fetchApi(GET_MY_PROFILE, "", false, token)
                .then((res) => {
                    dispatch(setPageLoader(false))
                    dispatch(setPageLoader(false))
                    setProfile(res.data.data[0])
                })
                .catch(() => {
                    dispatch(setPageLoader(false))
                    toast.error("something went wrong!")
                })
        }
    }

    const uploadPersonalPhoto = (e) => {
        setImageForModal(e.target.files[0])
        setImageOpenModal(true)
    }

    const photoUploadAndGetUrl = (image) => {
        dispatch(setPageLoader(true))
        let imageCompressor = new Compressor(image, {
            quality: 0.8,
            success: (compressedResult) => {
                return compressedResult
            },
        });
        let formData = new FormData()
        formData.append("file", imageCompressor.file)
        fetchApi(UPLOAD_PHOTO, formData, true)
            .then((res) => {
                if (res.data.status_code === 200) {
                    if (!editMode) {
                        fetchApi(EDIT_PROFILE, {
                            img: res.data.link
                        }, false, token)
                            .then((result) => {
                                fetchUserProfile()
                            })
                    }
                    else {
                        if (profile.photos) {
                            setProfile({
                                ...profile,
                                photos: [...profile.photos, res.data.link]
                            })
                        }
                        else {
                            setProfile({
                                ...profile,
                                photos: [res.data.link]
                            })
                        }
                        dispatch(setPageLoader(false))
                    }
                }
                else {
                    dispatch(setPageLoader(false))
                    toast.error("something went wrong!")
                }
            })
            .catch(() => {
                dispatch(setPageLoader(false))
                toast.error("something went wrong!")
            })
    }

    const submitNewInfo = () => {
        setActiveCard({
            university: false,
            work: false,
            info: false,
            skill: false,
            interest: false,
            hobby: false
        })
        setEditMode(false)
        fetchApi(EDIT_PROFILE,
            {
                university: profile?.university,
                work: profile?.work,
                personal_info: profile?.personal_info,
                skills: profile.skills,
                interests: profile?.interests,
                hobbies: profile?.hobbies,
                photos: profile?.photos,
            },
            false,
            token)
            .then((res) => {
                console.log(res)
            })
    }

    const submitEditModalData = (data) => {
        if (activeCard.hobby) {
            setProfile({
                ...profile,
                hobbies: data
            })
        }
        else if (activeCard.interest) {
            setProfile({
                ...profile,
                interests: data
            })
        }
        else if (activeCard.skill) {
            setProfile({
                ...profile,
                skills: data
            })
        }
        setOpenArrayCardsModal(false)
    }

    const photoGalleryUpload = (e) => {
        setImageForModal(e.target.files[0])
        setImageOpenModal(true)
    }

    const deleteImages = (index) => {
        let cloneImages = [...profile.photos]
        cloneImages.splice(index, 1)
        setProfile({
            ...profile,
            photos: cloneImages
        })
    }

    // other user
    const blockUser = () => {
        dispatch(setPageLoader(true))
        if (isBlocked) {
            fetchApi(UNBLOCK_USER, { userid: id }, false, token)
                .then((res) => {
                    dispatch(setPageLoader(false))
                    if (res.data.status_code === 200) {
                        fetchUserProfile()
                    }
                })
        }
        else {
            fetchApi(BLOCK_USER, { userid: id }, false, token)
                .then((res) => {
                    dispatch(setPageLoader(false))
                    if (res.data.status_code === 200) {
                        fetchUserProfile()
                    }
                })
        }
    }

    const chatWithUser = () => {
        let data = {
            img: profile.img,
            name: `${profile.frist_name} ${profile.last_name}`
        }
        dispatch(setChatType("user"))
        dispatch(setOtherUserData(data))
        navigate(`/chats/${profile._id}`)
    }

    useEffect(() => {
        dispatch(setFooterState(true))
        dispatch(changeFooterOption("profile"))
        fetchUserProfile()
    }, [])

    useEffect(() => {
        if (editMode) {
            dispatch(setFooterState(false))
        }
        else {
            dispatch(setFooterState(true))
        }
    }, [editMode])


    return (
        <div className='profilePage'>
            {
                openImageModal && <ImageCropModal imageSrc={imageForModal} handleCroppedImage={photoUploadAndGetUrl} modalCloser={() => setImageOpenModal(false)} />
            }
            {
                openArrayCardsModal &&
                <EditModal
                    data={activeCard.skill ? profile?.skills : activeCard.hobby ? profile?.hobbies : activeCard.interest ? profile?.interests : null}
                    submitHandler={submitEditModalData}
                />
            }
            {
                otherUserFlagModal &&
                <Modal
                    titlesWithFunctions={
                        [
                            { title: "Report a concern", func: () => setReportAConcernModal(true) },
                            { title: isBlocked ? "Unblock" : "Block", func: blockUser }
                        ]
                    }
                    cancelCallback={() => setOtherUserFlagModal(false)}
                />
            }
            {
                reportAConcernModal &&
                <ReportConcern
                    id={id}
                    isBlocked={isBlocked}
                    type={'user'}
                    refetchHandler={fetchUserProfile}
                    cancelClickHandler={() => setReportAConcernModal(false)}
                />
            }
            <div className="profileAppBar">
                <div className="appBarStuff">
                    <div className="uploadContainer">
                        <span className='cameraUploadImage'>
                            {
                                (profile.img || profile.image) ?
                                    <img
                                        src={!!profile.img ? profile.img : profile.image}
                                        alt={profile?.img}
                                        onClick={() => {
                                            if (id) return
                                            imageUploadRef.current.click()
                                        }}
                                    />
                                    :
                                    <Icon icon="uil:camera-plus" onClick={() => imageUploadRef.current.click()} />
                            }
                            <input type="file" accept='image/*' style={{ display: "none" }} ref={imageUploadRef} onChange={uploadPersonalPhoto} />
                        </span>
                        {
                            !id ?
                                <Icon className="uploadIcon" icon="ph:upload-simple-bold" onClick={() => imageUploadRef.current.click()} />
                                : null
                        }
                    </div>
                    <div className="profileRightSide">
                        <div className="userNameCont">
                            <div>
                                <p>{profile.frist_name} {profile.last_name}</p>
                                <p>{profile?.university}</p>
                            </div>
                            {
                                !id ?
                                    (
                                        !editMode ?
                                            <>
                                                <Icon icon="la:pen" onClick={() => setEditMode(true)} />
                                            </>
                                            : <Icon icon="material-symbols:check-circle-outline-rounded" color="#2AAD14" onClick={submitNewInfo} />
                                    )
                                    : null
                            }
                        </div>
                        <div className="profileActions">
                            {
                                id ?
                                    <>
                                        <div>
                                            <Icon icon="mdi:flag-variant" onClick={() => setOtherUserFlagModal(true)} />
                                        </div>
                                        <Icon icon="material-symbols:mail-outline-rounded" onClick={chatWithUser} />
                                    </>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="profileContent">
                {
                    id && profile?.photos?.length === 0 ? null :
                        <Fragment>
                            <p className="photoSectionHeader">Photos {id ? "" : "(up to 5)"}</p>
                            <div className="photoSection">
                                {
                                    editMode && (profile?.photos?.length < 5 || !profile.photos) ?
                                        <Icon icon="uil:image-upload" onClick={() => photoGalleryUploadRef.current.click()} />
                                        : null
                                }
                                {
                                    !editMode && !profile.photos
                                        ? <p style={{ margin: "auto" }}>No photos has been upload yet</p>
                                        :
                                        profile?.photos?.length !== 0 &&
                                        profile?.photos?.map((imgSrc, index) => {
                                            return <div key={index} className="photoGalleryPictures">
                                                {editMode && <Icon icon="iconoir:delete-circle" className='deleteIcon' onClick={() => deleteImages(index)} />}
                                                <ModalImage
                                                    className={"photoGalleryImg"}
                                                    small={imgSrc}
                                                    large={imgSrc}
                                                    alt="photo gallery"
                                                    draggable
                                                />
                                            </div>
                                        })
                                }
                                <input type="file" accept='image/*' ref={photoGalleryUploadRef} style={{ display: "none" }} onChange={photoGalleryUpload} />
                            </div>
                        </Fragment>
                }
                <div className="eachCard" onClick={() => setActiveCard({ ...activeCard, university: true })}>
                    <InfoCard
                        titleText={"University"}
                        data={profile?.university}
                        isEdit={editMode}
                        clicked={activeCard.university}
                        onChangeHandler={(e) => {
                            setProfile({
                                ...profile,
                                university: e.target.value
                            })
                        }}
                        other={id ? true : false}
                    />
                </div>
                <div className="eachCard" onClick={() => setActiveCard({ ...activeCard, work: true })}>
                    <InfoCard
                        titleText={"Work"}
                        data={profile?.work}
                        isEdit={editMode}
                        clicked={activeCard.work}
                        onChangeHandler={(e) => {
                            setProfile({
                                ...profile,
                                work: e.target.value
                            })
                        }}
                        other={id ? true : false}
                    />
                </div>
                <div className="eachCard" onClick={() => setActiveCard({ ...activeCard, info: true })}>
                    <InfoCard
                        titleText={"Personal Info"}
                        data={profile.personal_info}
                        isObject
                        isEdit={editMode}
                        clicked={activeCard.info}
                        onChangeHandler={(e) => {
                            setProfile({
                                ...profile,
                                personal_info: {
                                    ...profile.personal_info,
                                    [e.target.name]: e.target.value
                                }
                            })
                        }}
                        other={id ? true : false}
                    />
                </div>
                <div
                    className="eachCard"
                    onClick={() => {
                        if (editMode) {
                            setActiveCard({ ...activeCard, hobby: false, interest: false, skill: true })
                            setOpenArrayCardsModal(true)
                        }
                    }}
                >
                    <InfoCard titleText={"Skills"} data={profile.skills} isArray isEdit={editMode} clicked={activeCard.skill} other={id ? true : false} />
                </div>
                <div
                    className="eachCard"
                    onClick={() => {
                        if (editMode) {
                            setActiveCard({ ...activeCard, hobby: false, interest: true, skill: false })
                            setOpenArrayCardsModal(true)
                        }
                    }}
                >
                    <InfoCard titleText={"Insterests"} data={profile?.interests} isArray isEdit={editMode} clicked={activeCard.interest} other={id ? true : false} />
                </div>
                <div
                    className="eachCard"
                    onClick={() => {
                        if (editMode) {
                            setActiveCard({ ...activeCard, hobby: true, interest: false, skill: false })
                            setOpenArrayCardsModal(true)
                        }
                    }}>
                    <InfoCard titleText={"Hobbies"} data={profile?.hobbies} isArray isEdit={editMode} clicked={activeCard.hobby} other={id ? true : false} />
                </div>
                {
                    (!editMode && !id) &&
                    <div className="smallCardsCont">
                        <div className="smallCardSelf" onClick={() => navigate("/myactivity")}>
                            <Icon icon="mdi:database" />
                            <span>My activity</span>
                        </div>
                        <div className="smallCardSelf" onClick={() => navigate("/setting")}>
                            <Icon icon="ep:setting" />
                            <span>Setting</span>
                        </div>
                        <div className="smallCardSelf" onClick={() => navigate("/contactus")}>
                            <Icon icon="material-symbols:mail-outline-rounded" />
                            <span>Conatct us</span>
                        </div>
                    </div>
                }
                <br /><br /><br />
            </div>
        </div>
    )
}


export default Profile
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { fetchApi } from '../../api/FetchApi'
import image from "../../assets/images/setImage.png"
import ButtonComp from '../../components/button/ButtonComp'
import InputComp from '../../components/inputs/InputComp'
import Modal from '../../components/modal/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import ConfirmInfoModal from './component/ConfirmInfoModal'
import axios from 'axios'
import ImageCropModal from '../../components/imageCropModal/ImageCropModal'
import { setToken } from '../../redux/auth/authActions'
import { setFooterState } from '../../redux/footer/footerActions'

function UserInformationForm() {

    const mainAddress = "https://usa.iran.liara.run/";
    const SIGNIN = "user/sms/signin"
    const SIGNIN_EMAIL = "api/user/signin"
    const GET_CITIES = "api/get/city"
    const SIGNUP = "user/sms/signup"
    const UPLOAD_IMAGE = "user/img/s3"
    const EDIT_PROFILE = "user/edit/profile"

    let ref = useRef(null)
    let useCameraRef = useRef(null)
    let navigate = useNavigate()
    const dispatch = useDispatch()
    const verificationCode = useSelector(state => state.auth.v_code)
    const phoneNumber = useSelector(state => state.auth.phoneNumber)
    const [imageForModal, setImageForModal] = useState("")
    const [imageLink, setImageLink] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [inputFields, setInputFields] = useState({
        f_name: "",
        l_name: "",
        location: "",
        email: "",
        password: "",
        cPassword: ""
    })
    const [toggleCities, setToggleCities] = useState(false)
    const [allCities, setAllCities] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [chosenCity, setChosenCity] = useState("")
    const [confirmInfoModal, setConfirmInfoModal] = useState(false)
    const [cropImageModalState, setCropImageModalState] = useState(false)

    const chooseFromFile = () => {
        ref.current.click()
    }
    const chooseFromCamera = () => {
        useCameraRef.current.click()
    }

    const fetchCities = (pageNumber, search) => {
        if (search) {
            fetchApi(GET_CITIES,
                {
                    number: pageNumber,
                    search
                },
                false,
            )
                .then((res) => {
                    if (res.data.status_code === 200) {
                        setAllCities(res.data.data)
                        setMaxPage(res.data.max_page)
                    }
                    else if (res.data.status_code === 401) {

                    }
                    else if (res.data.status_code === 402) {
                        toast.error(res.data.description, { duration: 1500 })
                    }
                })
        }
        else {
            fetchApi(GET_CITIES, { number: pageNumber })
                .then((res) => {
                    if (res.data.status_code === 200) {
                        setAllCities([...allCities, ...res.data.data])
                        setMaxPage(res.data.max_page)
                    }
                    else if (res.data.status_code === 401) {
                        toast.error(res.data.description, { duration: 1500 })
                    }
                    else if (res.data.status_code === 402) {
                        toast.error(res.data.description, { duration: 1500 })
                    }
                })
        }
    }

    const changeHandler = (e) => {
        setInputFields({
            ...inputFields,
            [e.target.name]: e.target.value
        })
    }

    const openModalForCrop = (e) => {
        setImageForModal(e.target.files[0])
    }

    const uploadAndGetUrl = (blob) => {
        dispatch(setPageLoader(true))
        let formData = new FormData()
        formData.append("file", blob)
        fetchApi(UPLOAD_IMAGE, formData, true)
            .then((res) => {
                dispatch(setPageLoader(false))
                if (res.data.status_code === 200) {
                    setImageLink(res.data.link)
                }
                else if (res.data.status_code === 401) {
                    toast.error(res.data.description)
                }
                else if (res.data.status_code === 402) {
                    toast.error(res.data.description)
                }
            })
            .catch((err) => {
                dispatch(setPageLoader(false))
                console.error(err)
            })
    }

    const changeLocationInputField = (e) => {
        setToggleCities(true)
        setChosenCity(e.target.value)
        fetchCities(1, e.target.value)
    }

    const changeChosenCity = (id, title) => {
        setChosenCity(title)
        setInputFields({
            ...inputFields,
            location: id
        })
        setToggleCities(false)
    }

    const scrollPaginationhandler = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && page < maxPage) {
            let nextPage = page + 1
            setPage(nextPage)
            fetchCities(nextPage, "")
        }
    }

    const validateAndOpenModal = (e) => {
        e.preventDefault()
        if (!inputFields.f_name || !inputFields.l_name || !chosenCity || !inputFields.password || !inputFields.cPassword || !inputFields.email) {
            return toast.error("Fields must not be empty")
        }
        if (inputFields.f_name.length < 3) {
            return toast.error("First name must be atleast two letters")
        }
        if (inputFields.l_name.length < 3) {
            return toast.error("Last name must be atleast two letters")
        }
        if (inputFields.password !== inputFields.cPassword) {
            return toast.error("Password and Password Confirmation must be the same")
        }
        setConfirmInfoModal(true)
    }

    const closeConfirmInfoModal = () => {
        setConfirmInfoModal(false)
    }

    const handleSignUp = () => {
        dispatch(setPageLoader(true))
        fetchApi(SIGNUP, {
            f_name: inputFields.f_name,
            l_name: inputFields.l_name,
            email: inputFields.email,
            password: inputFields.password,
            location: chosenCity,
            phone_number: phoneNumber,
            v_code: verificationCode
        })
            .then((res) => {
                if (res.data.status_code === 200) {
                    let sendingData = {}
                    if (phoneNumber) {
                        sendingData.phone_number = phoneNumber
                        sendingData.v_code = verificationCode
                    }
                    else {
                        sendingData.email = inputFields.email
                        sendingData.password = inputFields.password
                    }
                    fetchApi(phoneNumber ? SIGNIN : SIGNIN_EMAIL, sendingData)
                        .then((singInRes) => {
                            if (singInRes.data.status_code === 200) {
                                dispatch(setToken(singInRes.data.user_token))
                                fetchApi(EDIT_PROFILE, { img: imageLink }, false, singInRes.data.user_token)
                                    .then((imageRes) => {
                                        dispatch(setPageLoader(false))
                                        if (imageRes.data.status_code === 200) {
                                            toast.success("Registered successfully!", { duration: 1000 })
                                            setTimeout(() => {
                                                navigate("/")
                                            }, 1000)
                                        }
                                    })
                                    .catch(() => {
                                        dispatch(setPageLoader(false))
                                    })
                            }else {
                                toast.error("Something went wrong", {duration: 1500})
                            }
                            dispatch(setPageLoader(false))
                        })
                }
                else if (res.data.status_code === 401) {
                    dispatch(setPageLoader(false))
                    toast.error(res.data.description, {duration: 1500})
                }
            })
    }

    useEffect(() => {
        dispatch(setPageLoader(false))
        dispatch(setFooterState(false))
        fetchCities(page, "")
    }, [])

    useEffect(() => {
        if (imageForModal) {
            setCropImageModalState(true)
        }
    }, [imageForModal])

    return (
        <>
            {
                cropImageModalState &&
                <ImageCropModal imageSrc={imageForModal} modalCloser={() => setCropImageModalState(false)} handleCroppedImage={uploadAndGetUrl} />
            }
            <div className='infoFromContainer'>
                {
                    openModal ?
                        <Modal
                            titlesWithFunctions={
                                [
                                    { title: "Take Photo", func: /*useCameraRef.current.click* BOTH POSSIBLE*/ chooseFromCamera },
                                    { title: "Choose From Library", func: /*ref.current.click BOTH POSSIBLE */ chooseFromFile }
                                ]
                            }
                            cancelCallback={() => setOpenModal(false)} />
                        : ""
                }
                {
                    confirmInfoModal &&
                    <ConfirmInfoModal info={inputFields} userImg={imageLink} cityName={chosenCity} requestSignUp={handleSignUp} closeModalFunc={closeConfirmInfoModal} />
                }
                <div className="infoFormHead">
                    <h2>choose a picture</h2>
                    <img src={!!imageLink ? imageLink : image} alt={image} />
                    <div className="imageUploadCont" onClick={() => setOpenModal(true)}>
                        <Icon icon="fluent:camera-add-24-regular" />
                    </div>
                </div>
                <input type="file" accept='image/*' capture="enviroment" style={{ display: "none" }} ref={useCameraRef} onChange={openModalForCrop} />
                <input type="file" accept='image/*' style={{ display: "none" }} ref={ref} onChange={openModalForCrop} />
                <form className='userInfoFrom' onSubmit={validateAndOpenModal}>
                    <InputComp
                        name={"f_name"}
                        labelInnerText={"First Name"}
                        inputType={"text"}
                        underInputnotice={"Must be more than 2 letters"}
                        onChangeHandler={changeHandler}
                    />
                    <InputComp
                        name={"l_name"}
                        labelInnerText={"Last Name"}
                        inputType={"text"}
                        underInputnotice={"Must be more than 2 letters"}
                        onChangeHandler={changeHandler}
                    />
                    <InputComp
                        name={"email"}
                        labelInnerText={"Email"}
                        inputType={"email"}
                        onChangeHandler={changeHandler}
                    />
                    <InputComp
                        name={"password"}
                        labelInnerText={"Password"}
                        inputType={"password"}
                        onChangeHandler={changeHandler}
                    />
                    <InputComp
                        name={"cPassword"}
                        labelInnerText={"Confirm Password"}
                        inputType={"password"}
                        onChangeHandler={changeHandler}
                    />
                    <div className="chooseLocationField">
                        <label htmlFor="locationDropdown">
                            Location
                        </label>
                        <input
                            className="locationDropdownInput"
                            type="text"
                            placeholder={"choose your location"}
                            value={chosenCity}
                            onChange={changeLocationInputField}
                            onFocus={() => setToggleCities(true)}
                        />
                        <div className="foundCities" onScroll={scrollPaginationhandler}>
                            {
                                toggleCities &&
                                    allCities.length !== 0 ?
                                    allCities.map((city, index) => {
                                        return <p onClick={() => changeChosenCity(city._id, city.cityname)} key={index}>
                                            <span>{index + 1}</span>
                                            <span>{city.cityname}</span>
                                            <span>{city.Address}</span>
                                        </p>
                                    })
                                    : ""
                            }
                        </div>
                        <span>or closest city</span>
                    </div>
                </form>
                <div className="agreeToTerms">
                    <Link to={"/terms"}>Terms & Conditions</Link>
                    <ButtonComp innerText={"Agree & Join"} light={true} onClickHandler={validateAndOpenModal} />
                </div>
            </div>
        </>
    )
}

export default UserInformationForm

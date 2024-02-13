import React, { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import AppBar from '../../components/appBar/AppBar'
import ButtonComp from '../../components/button/ButtonComp'
import ImageCropModal from '../../components/imageCropModal/ImageCropModal'
import InputComp from '../../components/inputs/InputComp'
import Switcher from '../../components/switcher/Switcher'
import { setFooterState } from '../../redux/footer/footerActions'
import { setPageLoader } from '../../redux/loaders/loaderActions'


function NewGroup() {

    const UPLOAD_IMAGE = "user/img/s3"
    const CREATE_GROUP = "api/user/group/create"
    const GET_INSTITUTIONAL_EMAIL = "api/user/get/institutional/email"
    // const EDIT_GROUP = "api/user/group/edit"

    let imageUploadRef = useRef()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const navigate = useNavigate()

    const [inputFields, setInputFields] = useState({
        groupName: "",
        groupTopic: "",
        institutionalEmail: ""
    })
    const [emailList, setEmailList] = useState([])
    const [isInstitution, setIsInstitution] = useState(false)
    const [isBussiness, setIsBussiness] = useState(false)
    const [imageForCrop, setImageForCrop] = useState("")
    const [cropImageModalState, setCropImageModalState] = useState(false)
    const [imageLink, setImageLink] = useState("")

    const handleGroupImageChange = (e) => [
        setImageForCrop(e.target.files[0])
    ]

    const getInstitutionalEmails = () => {
        fetchApi(GET_INSTITUTIONAL_EMAIL, '', false, token)
            .then((res) => {
                setEmailList(res.data.data)
            })
    }

    const uploadAndGetUrl = (file) => {
        dispatch(setPageLoader(true))
        let formData = new FormData()
        formData.append("file", file)
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
                toast.error("Some thing went wrong!")
                dispatch(setPageLoader(false))
                console.error(err)
            })
    }

    const changeHandler = (e) => {
        setInputFields({
            ...inputFields,
            [e.target.name]: e.target.value
        })
    }

    const handleCreatingGroup = (e) => {
        e.preventDefault()
        if (isInstitution && !inputFields.institutionalEmail) {
            return toast.error("in institutional groups, an institutionl email must be chosen", { duration: 4000 })
        }
        if (!inputFields.groupName || !inputFields.groupTopic) {
            return toast.error("filling all fields is required!", { duration: 2000 })
        }
        dispatch(setPageLoader(true))
        fetchApi(CREATE_GROUP, {
            title: inputFields.groupName,
            img: imageLink,
            dis: inputFields.groupTopic,
            bussiness: isBussiness,
            inst: isInstitution ? inputFields.institutionalEmail : "",
        },
            false,
            token
        )
            .then((res) => {
                if (res.data.status_code === 200) {
                    dispatch(setPageLoader(false))
                    toast.success("Group created!!", { duration: 1500 })
                    setTimeout(() => {
                        navigate("/", { replace: true })
                    }, 1500)
                }
            })
    }

    useEffect(() => {
        getInstitutionalEmails()
        dispatch(setPageLoader(false))
        dispatch(setFooterState(false))
    }, [])


    useEffect(() => {
        if (imageForCrop) {
            setCropImageModalState(true)
        }
    }, [imageForCrop])

    return (
        <div className='newGroupPage'>
            <AppBar innerText={"New Group"} navigateTo={"/"} />
            {
                cropImageModalState &&
                <ImageCropModal handleCroppedImage={uploadAndGetUrl} imageSrc={imageForCrop} modalCloser={() => setCropImageModalState(false)} />
            }
            <div className="imageUploadContainer">
                {
                    imageLink ?
                        <div className="imageUploadChange">
                            <img src={imageLink} alt={imageLink} />
                            <Icon icon="material-symbols:add-circle-outline-rounded" onClick={() => imageUploadRef.current.click()} />
                        </div>
                        :
                        <Icon icon="iconoir:add-media-image" onClick={() => imageUploadRef.current.click()} />
                }
                <input type="file" accept='image/*' ref={imageUploadRef} onChange={handleGroupImageChange} />
            </div>
            <form className="newGroupsFrom">
                <div className="switchGroup">
                    <h3>Institutional Group</h3>
                    <Switcher state={isInstitution} handleChange={(e) => setIsInstitution(e)} />
                </div>
                <div className="inputGroup">
                    <p>Institutional Group</p>
                    <select
                        value={isInstitution ? inputFields.institutionalEmail : ""}
                        name='institutionalEmail'
                        disabled={!isInstitution}
                        onChange={changeHandler}
                    >
                        <option value="" disabled>choose your institutional email</option>
                        {
                            emailList.map((item, index) => (
                                <option key={index} className="emailRow" value={item.verified_email}>
                                    {item.verified_email}
                                </option>
                            ))
                        }
                    </select>
                    <span>
                        In institutional groups, only pepole with the verified
                        institution email address can join.
                    </span>
                </div>
                <div className="inputGroup">
                    <p>Group Name</p>
                    <InputComp name={"groupName"} onChangeHandler={changeHandler} />
                </div>
                <div className="inputGroup">
                    <p>Description</p>
                    <InputComp name={"groupTopic"} onChangeHandler={changeHandler} />
                </div>
                <div className="switchGroup">
                    <h3>Is this a business group</h3>
                    <Switcher state={isBussiness} handleChange={(e) => setIsBussiness(e)} />
                </div>
                <span className="advice">
                    Make sure you activate your business group
                    by going to the group settings and paying the fee
                </span>
                <ButtonComp innerText={"Create"} width={75} light onClickHandler={handleCreatingGroup} />
            </form>
        </div>
    )
}

export default NewGroup
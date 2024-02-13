import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import AppBar from '../../components/appBar/AppBar'
import UpModal from '../../components/modal/UpModal'
import Switcher from '../../components/switcher/Switcher'
import { setToken, setVerificationCode } from '../../redux/auth/authActions'
import { setFooterState } from '../../redux/footer/footerActions'
import { disableUserProfile, hideUserProfile } from '../../redux/setting/settingActions'
import { Icon } from '@iconify/react'

function Setting() {

    const GET_INSTITUTIONAL_EMAIL = "api/user/get/institutional/email"
    const DELETE_INSTITUTIONAL = "api/user/delete/institutional/email"
    const HIDE_PROFILE = "api/profile/hide"
    const DISABLE_PROFILE = "api/profile/disable"
    const DELETE_PROFILE = "api/profile/delete"

    const token = useSelector(state => state.auth.token)
    const navigate = useNavigate()

    const hideProfile = useSelector(state => state.setting.hideProfile)
    const disableProfile = useSelector(state => state.setting.disableProfile)
    const dispatch = useDispatch()

    const [emailList, setEmailList] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [accountPassword, setAccountPassword] = useState("")

    const fetchEmails = () => {
        fetchApi(GET_INSTITUTIONAL_EMAIL, "", false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    setEmailList(res.data.data)
                }
            })
    }

    const deleteEmail = (email) => {
        fetchApi(DELETE_INSTITUTIONAL, { email }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    fetchEmails()
                }
            })
    }

    const handelHideOrShowProfile = (state) => {
        fetchApi(HIDE_PROFILE, { status: state }, false, token)
            .then((res) => {
                console.log(res);
            })
    }

    const handleDisableOrEnableProfile = (state) => {
        fetchApi(DISABLE_PROFILE, { status: state }, false, token)
            .then((res) => {
                console.log(res);
            })
    }

    const deleteUserAccount = () => {
        if (!accountPassword) {
            return toast.error("Enter the password!", { duration: 1000 })
        }
        // todo check the password you get from some where with this one then let him die peacefully
        fetchApi(DELETE_PROFILE, { pass: accountPassword }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    setOpenModal(false)
                    dispatch(setToken(""))
                    navigate("/signin", { replace: true })
                }
                else if (res.data.status_code === 400) {
                    toast.error("Incorrect Password!", { duration: 1500 })
                }
            })
    }

    useEffect(() => {
        dispatch(setFooterState(false))
        fetchEmails()
    }, [])

    return (
        <div className='settingPage'>
            <AppBar innerText={"Settings"} navigateTo={-1} />
            {
                openModal &&
                <UpModal
                    question={"Are you sure you want to delete your account?"}
                    yesContent={"Delete"}
                    noContent={"Cancel"}
                    yesClickHandler={deleteUserAccount}
                    noClickHandler={() => setOpenModal(false)}
                    passowrdChangeHanler={(e) => setAccountPassword(e.target.value)}
                    needsPassword
                />
            }
            <div className="settingComp">
                <div className="institutionalEmails">
                    <span>Your institutional emails</span>
                    <div className="institutionalEmail">
                        {
                            emailList.map((item, index) => (
                                <div key={index} className="emailRow">
                                    <span>{item.verified_email}</span>
                                    <span onClick={() => deleteEmail(item.verified_email)}><Icon icon="typcn:delete-outline" fontSize={24} color='red' /></span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="settingButtons">
                    <div className="settingCard" onClick={() => navigate("/support")}>
                        Support us
                    </div>
                    <div className="settingCard">
                        Hide profile from search
                        <Switcher
                            state={hideProfile}
                            handleChange={(e) => {
                                dispatch(hideUserProfile(!hideProfile))
                                handelHideOrShowProfile(e)
                            }}
                        />
                    </div>
                    <div className="settingCard" onClick={() => navigate("/contactus")}>
                        Contact Support
                    </div>
                    <div className="settingCard" onClick={() => setOpenModal(true)}>
                        Delete Account
                    </div>
                    <div className="settingCard">
                        Disable Account
                        <Switcher
                            state={disableProfile}
                            handleChange={(e) => {
                                dispatch(disableUserProfile(!disableProfile))
                                handleDisableOrEnableProfile(!e)
                            }}
                        />
                    </div>
                    <div
                        className="settingCard"
                        onClick={() => {
                            dispatch(setToken(""))
                            dispatch(setVerificationCode(""))
                            navigate("/signin")
                        }}
                    >
                        Sign Out
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting
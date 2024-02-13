import { useState, useEffect, lazy, Suspense, Fragment } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchApi } from '../../api/FetchApi'
import AppBar from '../../components/appBar/AppBar'
// import InfoCard from '../../components/cards/InfoCard'
// import MainCards from '../../components/cards/MainCard'
import Switcher from '../../components/switcher/Switcher'
import { setPageLoader } from '../../redux/loaders/loaderActions'
import { useQuery } from '@tanstack/react-query'
import { ClipLoader } from 'react-spinners'
import { Icon } from '@iconify/react'
// import UpModal from '../../components/modal/UpModal'
// import AssignAdminModal from './components/AssignAdminModal'
// import ChangeOwnerModal from './components/ChangeOwnerModal'

const AssignAdminModal = lazy(() => import("./components/AssignAdminModal"))
const ChangeOwnerModal = lazy(() => import("./components/ChangeOwnerModal"))
const Modal = lazy(() => import("../../components/modal/Modal"))
const UpModal = lazy(() => import("../../components/modal/UpModal"))

function GroupSetting() {

    const GET_GROUP_INFO = "api/user/group/get"
    const GET_ADMIN = "api/get/user/group_admin" // groupid
    const ASSIGN_ADMIN = "api/user/group/create_admin" // groupid, userid
    const CHANGE_OWNER = "api/user/group/change_owner" // groupid, userid
    const DISABLE_GROUP = "api/user/group/status"
    const DELETE_GROUP = "api/user/group/delete" // groupid
    const DELETE_ADMIN = "api/user/group/delete_admin" // groupid, userid

    let { id } = useParams()
    const navigate = useNavigate()

    const { token, myUserId } = useSelector(state => ({
        token: state.auth.token,
        myUserId: state.profile.id
    }))
    const dispatch = useDispatch()

    const [disableGroup, setDisableGroup] = useState(false)
    const [modalStates, setModalStates] = useState({
        assignAdminModalState: false,
        changeOwnerModalState: false,
        askBeforeDeleteModal: false,
        confirmRemovalModalState: false
    })
    const [chosenId, setChosenId] = useState('')
    const [removeLoader, setRemoveLoader] = useState(false)

    const fetchGroupData = async () => {
        const res = await fetchApi(GET_GROUP_INFO, { groupid: id }, false, token)
        setDisableGroup(!res?.data[0]?.status)
        return res.data
    }

    const fetchAdminData = async () => {
        const res = await fetchApi(GET_ADMIN, { groupid: id, search: '' }, false, token)
        return res.data.Admins
    }

    const assignAdmin = (data) => {
        dispatch(setPageLoader(true))
        fetchApi(ASSIGN_ADMIN, { userid: data.user, groupid: data.group }, false, token)
            .then((res) => {
                dispatch(setPageLoader(false))
                if (res.data.status_code === 200) {
                    refetchAdmins()
                    setModalStates({
                        ...modalStates,
                        assignAdminModalState: false
                    })
                }
                refetchAdmins()
            })
    }

    const removeAdmin = () => {
        setRemoveLoader(true)
        fetchApi(DELETE_ADMIN, { userid: chosenId, groupid: id }, false, token)
            .then((res) => {
                setRemoveLoader(false)
                if (res.data.status_code === 200) {
                    refetchAdmins()
                }
                else if (res.data.status_code === 400) {
                    toast.error(res.data.description)
                }
            })
    }

    const changeOwner = (data) => {
        fetchApi(CHANGE_OWNER, { userid: data.admin, groupid: data.group }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    setModalStates({
                        ...modalStates,
                        changeOwnerModalState: false
                    })
                    toast.success("Group owner changed", { duration: 2000 })
                    navigate(-1)
                }
                else if (res.data.status_code === 400) {
                    toast.error(res.data.description)
                }
            })
    }

    const handleDisableGroup = (status) => {
        fetchApi(DISABLE_GROUP, { id, status }, false, token)
            .then((res) => {
                console.log(res);
            })
    }

    const deleteGroup = () => {
        dispatch(setPageLoader(true))
        fetchApi(DELETE_GROUP, { groupid: id }, false, token)
            .then((res) => {
                dispatch(setPageLoader(false))
                toast.success("Group deleted successfully!!", { duration: 1500 })
                setTimeout(() => {
                    navigate("/", { replace: true })
                }, 1500)
            })
    }

    const {
        data: groupData,
        isLoading: isLoadingGroupData,
        refetch: refetchGroupData
    } = useQuery({
        queryKey: ['groupData'],
        queryFn: fetchGroupData
    })

    const {
        data: adminData,
        isLoading: isLoadingAdmins,
        refetch: refetchAdmins
    } = useQuery({
        queryKey: ['admins'],
        queryFn: fetchAdminData
    })

    return (
        <div className="groupSettingPage">
            <Suspense>
                {
                    modalStates.changeOwnerModalState ?
                        <ChangeOwnerModal
                            groupName={groupData?.data[0].group_title}
                            adminData={adminData}
                            onAssign={changeOwner}
                            closer={() => setModalStates({
                                ...modalStates,
                                changeOwnerModalState: false
                            })}
                        />
                        : null
                }
                {
                    modalStates.assignAdminModalState ?
                        <AssignAdminModal
                            groupName={groupData?.data[0].group_title}
                            groupid={id}
                            onAssign={assignAdmin}
                            closer={() => setModalStates({
                                ...modalStates,
                                assignAdminModalState: false
                            })}
                        />
                        : null
                }
                {
                    modalStates.askBeforeDeleteModal ?
                        <UpModal
                            question={"Are you sure you want to delete this group?"}
                            yesContent={"Yes"}
                            yesClickHandler={deleteGroup}
                            noContent={"No"}
                            noClickHandler={() => setModalStates({
                                ...modalStates,
                                askBeforeDeleteModal: false
                            })}
                        />
                        : null
                }
                {
                    modalStates.confirmRemovalModalState ?
                        <Modal
                            titlesWithFunctions={[
                                {
                                    title: 'Confirm removal',
                                    func: removeAdmin
                                }
                            ]}
                            cancelCallback={() => setModalStates({
                                ...modalStates,
                                confirmRemovalModalState: false
                            })}
                        />
                        : null
                }
            </Suspense>
            <AppBar innerText={"Settings"} navigateTo={-1} />
            <div className="settingContent">
                <h2 className="groupName">{groupData?.data[0].group_title}</h2>
                <div className="paymentInfoContainer">
                    <p>Payment information</p>
                </div>
                <span>Owner: </span>
                <span className='personName'>
                    {
                        isLoadingGroupData ?
                            <ClipLoader size={12} />
                            :
                            <span>
                                {groupData?.data[0]?.Owner_info[0]?.frist_name} {groupData?.data[0]?.Owner_info[0]?.last_name}
                            </span>

                    }
                </span>
                <div className="adminsContainer">
                    <p>Admins:</p>
                    {
                        isLoadingAdmins ? (
                            <ClipLoader size={12} />
                        )
                            : (
                                adminData?.length !== 0 ?
                                    adminData?.map((admin, index) => (
                                        <div key={index} className='adminRow'>
                                            <span>{admin?.admin_info[0]?.frist_name} {admin?.admin_info[0]?.last_name}</span>
                                            {
                                                groupData?.owner ?
                                                    <span onClick={() => {
                                                        setChosenId(admin.admin)
                                                        setModalStates({
                                                            ...modalStates,
                                                            confirmRemovalModalState: true
                                                        })
                                                    }}>
                                                        {
                                                            removeLoader ?
                                                                <ClipLoader size={22} />
                                                                :
                                                                <Icon
                                                                    icon="iconoir:delete-circle"
                                                                    color='red'
                                                                    fontSize={22}

                                                                />
                                                        }
                                                    </span>
                                                    : null
                                            }
                                        </div>
                                    ))
                                    : <p className="noData">No admins have been chosen</p>
                            )
                    }
                </div>
                {
                    groupData?.owner ?
                        <div className="groupAdminAndOwnerAdd">
                            <button
                                onClick={() => setModalStates({
                                    ...modalStates,
                                    assignAdminModalState: true
                                })}
                            >
                                Add Admin
                            </button>
                            <button
                                onClick={() => setModalStates({
                                    ...modalStates,
                                    changeOwnerModalState: true
                                })}
                            >
                                Change Owner
                            </button>
                        </div>
                        : null
                }
                <div className="groupSettingCard" onClick={() => navigate(`/bussinessPayment?id=${id}`)}>
                    <span>Activate bussiness group</span>
                </div>
                <div className="groupSettingCard" onClick={() => navigate("/contactus")}>
                    <span>Contact support</span>
                </div>
                <div className="groupSettingCard">
                    <span>Disable group</span>
                    <Switcher
                        state={disableGroup}
                        handleChange={(e) => {
                            handleDisableGroup(!e)
                            setDisableGroup(e)
                        }}
                    />
                </div>
                {
                    groupData?.owner ?
                        <div
                            className="groupSettingCard"
                            onClick={() => setModalStates({
                                ...modalStates,
                                askBeforeDeleteModal: true
                            })}
                        >
                            <span>Delete group</span>
                        </div>
                        : null
                }
            </div>
        </div >
    )
}

export default GroupSetting
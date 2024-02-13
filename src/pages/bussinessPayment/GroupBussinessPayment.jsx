import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import AppBar from "../../components/appBar/AppBar"
import { fetchApi } from "../../api/FetchApi";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { setPageLoader } from "../../redux/loaders/loaderActions";
import ButtonComp from "../../components/button/ButtonComp";
import { setFooterState } from "../../redux/footer/footerActions";
import toast from "react-hot-toast";

function GroupBussinessPayment() {

    const GET_GROUP_INFO = "api/user/group/get"
    const GET_BUSSINESS_PLANS = "api/plan/user/get_all" // number
    const PAY_REQUEST = "api/user/pay/request" // mony, groupid

    const [searchParams] = useSearchParams()

    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()

    const [selectedPlan, setSelectedPlan] = useState('')

    const navigate = useNavigate()

    const getGroupData = async () => {
        let result = await fetchApi(GET_GROUP_INFO, { groupid: searchParams.get('id') }, false, token)
        return result.data
    }

    const getPlanData = async () => {
        let result = await fetchApi(GET_BUSSINESS_PLANS, { number: 1 }, false, token)
        return result.data.data
    }

    const {
        data: groupData,
        isLoading: isLoadingGroupData
    } = useQuery({
        queryFn: getGroupData,
        queryKey: ['groupdata']
    })

    const {
        data: plans,
        isLoading: isloadingPlans
    } = useQuery({
        queryFn: getPlanData,
        queryKey: ['plans']
    })

    const handlePay = () => {
        if (!selectedPlan) {
            return toast.error("please select a plan!")
        }
        fetchApi(PAY_REQUEST, { groupid: searchParams.get('id'), mony: selectedPlan }, false, token)
            .then((res) => {
                if (res.data.status_code === 200) {
                    window.open(res.data.payment_link)
                }
                else if (res.data.status_code === 400) {
                    toast.error(res.data.description)
                }
            })
    }

    useEffect(() => {
        dispatch(setFooterState(false))
    }, [])

    useEffect(() => {
        if (isLoadingGroupData || isloadingPlans) {
            dispatch(setPageLoader(true))
        }
        else {
            dispatch(setPageLoader(false))
        }
    }, [isLoadingGroupData, isloadingPlans])

    return (
        <div>
            <AppBar innerText={'Payment'} navigateTo={-1} />
            <div className="bussinessPay">
                <h3 className="groupTitle">{groupData?.data[0]?.group_title}</h3>
                <p className="priceSectionTitle">Choose your plan, prices are per year</p>
                <div className="prices">
                    {
                        plans?.length !== 0 ?
                            plans?.map((plan) => (
                                <ButtonComp
                                    key={plan._id}
                                    innerText={`$${plan.payment}`}
                                    light={selectedPlan !== plan._id}
                                    onClickHandler={() => setSelectedPlan(plan._id)}
                                />
                            ))
                            : null
                    }
                </div>
                <div className="plans">
                    <p>Bussiness group fees:</p>
                    {
                        plans?.length !== 0 ?
                            plans?.map((plan) => (
                                <p key={plan._id}>
                                    Bussiness group {plan.limit} members: {plan.payment}$ / year
                                </p>
                            ))
                            : null
                    }
                    <p>Contact <Link to={'/contactus'}>support team</Link> for any questions</p>
                </div>
                <p className="termsAdnConditions" onClick={() => navigate('/terms')}>Terms and conditions</p>
                <div className="actions">
                    <ButtonComp innerText={"Proceed to payment"} light onClickHandler={handlePay} />
                </div>
            </div>
        </div>
    )
}

export default GroupBussinessPayment
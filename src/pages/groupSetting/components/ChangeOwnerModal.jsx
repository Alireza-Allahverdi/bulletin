import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setFooterState } from '../../../redux/footer/footerActions'
import AppBar from '../../../components/appBar/AppBar'
import MainCards from '../../../components/cards/MainCard'

function ChangeOwnerModal({ groupName, adminData,onAssign, closer }) {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setFooterState(false))
  }, [])

  return (
    <div className="changeOwnerModalContainer">
      <AppBar innerText={"Change Owner"} onlyCall={closer} />
      <h3>{groupName}</h3>
      {
        adminData.length === 0
        ? <p className="noData">No admins have been added</p>
        :
      <div className="changeOwnerContent">
        <p className="sectionHeader">Admins</p>
        {
          adminData.map((admin, index) => (
            <MainCards
                key={index}
                image={admin?.admin_info[0].img || admin?.admin_info[0].image}
                titleText={`${admin?.admin_info[0].frist_name} ${admin?.admin_info[0].last_name}`}
                buttonInnerText={"Select"}
                onButtonClick={() => onAssign(admin)}
                customizeStyle={{ margin: '10px 0' }}
              />
          ))
        }
      </div>
      }
    </div>
  )
}

export default ChangeOwnerModal
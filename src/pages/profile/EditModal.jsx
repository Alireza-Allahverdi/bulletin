import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import ButtonComp from '../../components/button/ButtonComp'

function EditModal({ data, submitHandler }) {

  const [boxData, setBoxData] = useState([])
  const [inputField, setInputField] = useState("")

  const addItem = (e) => {
    e.preventDefault()
    if (inputField) {
      if (boxData.includes(inputField)) {
        return toast.error("already in your list", {duration: 2000})
      }
      if (boxData.length === 5) {
        return toast.error("you can only add up to 5 items")
      }
      setBoxData([...boxData, inputField])
      setInputField("")
    }
  }

  const deleteItem = (index) => {
    let cloneData = [...boxData]
    cloneData.splice(index, 1)
    setBoxData(cloneData)
  }

  const submitData = () => {
    submitHandler(boxData)
  }

  useEffect(() => {
    if (data) {
      setBoxData([...data])
    }
  }, [])

  return (
    <div className='editModalContainer'>
      <div className="editModalSelf">
        <form className="modalForm" onSubmit={addItem}>
          <Icon icon="material-symbols:add" onClick={addItem} />
          <input type="text" value={inputField} onChange={(e) => setInputField(e.target.value)} />
        </form>
        <div className="cardItems">
          {
            boxData.length !== 0 ?
              boxData.map((item, index) => {
                return <p key={index}>
                  {item}
                  <Icon icon="iconoir:delete-circle" onClick={() => deleteItem(index)}/>
                </p>
              })
              : null
          }
        </div>
        <ButtonComp innerText={"Done"} onClickHandler={submitData} width={80}/>
      </div>
    </div>
  )
}

export default EditModal
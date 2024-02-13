import React from 'react'
import { Icon } from '@iconify/react'

function InputField({ value, onChangeHandler, handleSubmit, isBlocked }) {
  return (
    <form className="chatInput" onSubmit={handleSubmit}>
      {
        isBlocked ?
          <p>This chat is blocked, no msg can be sent or recieved</p>
          :
          <>
            <input type="text" value={value} onChange={onChangeHandler} />
            <Icon icon="material-symbols:send-rounded" onClick={handleSubmit} />
          </>
      }
    </form>
  )
}

export default InputField
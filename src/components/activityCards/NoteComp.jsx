import React from 'react'
import { Icon } from '@iconify/react'

function NoteComp({ text, noteText, bgc, isEdit, removeClickHandler, noteClickHandler }) {

  return (
    <div className="noteConatiner" style={{borderBottom: `3px solid ${bgc}`}}>
      {
        isEdit &&
        <button onClick={removeClickHandler}>
          <Icon icon="ph:trash" />
        </button>
      }
      <div className="noteIcon" style={{ backgroundColor: bgc }} >
        <Icon icon="healthicons:i-note-action" />
      </div>
      <span onClick={noteClickHandler}>{text}</span>
      {
        noteText ?
          <p>{noteText}</p>
          : null
      }
    </div>
  )
}

export default NoteComp
import React from 'react'

function ButtonComp({ innerText, light, fontSize, onClickHandler, cancel, width, noBoxShadow, borderRadius }) {
  return (
    <button
      className={`btnComp ${light ? "lightBtn" : "darkBtn"}`}
      style={{
        fontSize: `${fontSize}px`,
        width: `${width}px`,
        boxShadow: noBoxShadow ? "none" : "initial",
        borderRadius: `${borderRadius}px`,
        backgroundColor: cancel ? "#C95A5A" : ""
      }}
      onClick={onClickHandler}
    >
      {innerText}
    </button>
  )
}

export default ButtonComp
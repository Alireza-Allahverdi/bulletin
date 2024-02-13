import React from 'react'
import Switch from "react-switch";

function Switcher({ state, handleChange }) {
  return (
    <label htmlFor="">
      <Switch
        checked={state}
        onChange={handleChange}
        onColor="#0071BC"
        onHandleColor="#fff"
        handleDiameter={15}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={25}
        width={50}
        className="react-switch"
        id="material-switch"
      />
    </label>
  )
}

export default Switcher
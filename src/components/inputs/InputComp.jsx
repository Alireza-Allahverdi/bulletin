import { Icon } from '@iconify/react'
import React from 'react'

function InputComp({ placeHolder, inputType, labelInnerText, iconInside, iconBeside, noBoxShadow, onChangeHandler, value, underInputnotice, name }) {
    return (
        <div className={`inputCompCont ${labelInnerText ? "hasLabel" : ""}`}>
            {
                iconBeside &&
                <span className='iconBeside'>
                    <Icon icon={iconBeside} />
                </span>
            }
            {
                iconInside &&
                <span className="iconInside">
                    <Icon icon={iconInside} />
                </span>
            }
            {
                labelInnerText ?
                    <div className="inputCompWithLabel" >
                        <label htmlFor="input">{labelInnerText}</label>
                        <input
                            name={name}
                            className='inputComp withLabel'
                            id='input'
                            type={inputType}
                            placeholder={placeHolder}
                            onChange={onChangeHandler}
                        />
                        <span>{underInputnotice}</span>
                    </div>
                    :
                    <input
                        name={name}
                        className='inputComp'
                        id='input'
                        type={inputType}
                        value={value}
                        placeholder={placeHolder}
                        style={{ boxShadow: noBoxShadow ? "" : "initial" }}
                        onChange={onChangeHandler}
                    />
            }
        </div>
    )
}

export default InputComp
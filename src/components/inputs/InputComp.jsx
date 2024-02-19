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
                            autoCorrect="none"
                            autoCapitalize="none"
                            autoComplete='none'
                            style={{
                                textTransform:inputType === "email" ? "lowercase" : ""
                            }}
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
                        style={{ boxShadow: noBoxShadow ? "" : "initial", textTransform: inputType === "email" ? "lowercase" : "" }}
                        onChange={onChangeHandler}
                        autoCorrect="none"
                        autoCapitalize="none"
                        autoComplete='none'
                    />
            }
        </div>
    )
}

export default InputComp
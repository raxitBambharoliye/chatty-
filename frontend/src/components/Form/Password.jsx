import React, { useId, useState } from 'react'

function Password({
    inputClass = '',
    placeholder = "",
    label = "",
    ...props
}, ref) {
    const [type, setType] = useState("password");
    const id = useId();
    const changeType = () => {
        if (type == "password") {
            setType("text");
        } else {
            setType("password");
        }
    }
    return (
        <div className={`mb-3 ${inputClass} `}>
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <div className="position-relative">

                <input type={type} className="form-control" id={id} placeholder={placeholder} ref={ref} {...props} />
                <button onClick={changeType} type='button' className='passwordIcon'>
                    {type == "password" ? <i className="fa-solid fa-eye" /> : <i className="fa-solid fa-eye-slash" />}
                </button>
            </div>
        </div>
    )
}

export default React.forwardRef(Password)

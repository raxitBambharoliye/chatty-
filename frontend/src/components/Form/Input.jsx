import React, { useId } from 'react'

function Input({
    inputClass = '',
    type = "text",
    placeholder = "",
    label = "",
    onChange=()=>{},
    ...props
},ref) {
    const id = useId();
    return (
        <div className={`mb-3 ${inputClass}`}>
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <input type={type} className="form-control" id={id} placeholder={placeholder} onChange={onChange} ref={ref} {...props} />
        </div>
    )
}

export default React.forwardRef(Input)

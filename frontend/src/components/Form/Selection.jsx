import React, { useId } from 'react'

function Selection({
    options=[],
    inputClass = '',
    type = "selection",
    placeholder = "",
    label = "",
    onChange = () => { },
    ...props
}, ref) {
    const id = useId();
    return (
        <div className={`mb-3 ${inputClass}`}>
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <select className='form-control' id={id} ref={ref} {...props} multiple >

                {(options&&options.length) &&options.map((element, index) => (
                    <option value={element._id} key={`selectionOption${index}`}>{element.userName }</option>
                ))}
            </select>
        </div>
    )
}

export default React.forwardRef(Selection)

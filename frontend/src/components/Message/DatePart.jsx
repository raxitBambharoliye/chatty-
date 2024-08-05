import React from 'react'

function DatePart({text}) {
    return (
        <div className='datePart d-flex align-items-center'>
            <div className="part flex-grow-1"></div>
            <p className='m-0 mx-2'>{text}</p>
            <div className="part flex-grow-1"></div>
        </div>
    )
}

export default DatePart

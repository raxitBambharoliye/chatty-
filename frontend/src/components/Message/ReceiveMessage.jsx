import React from 'react'

function ReceiveMessage({ message, profile = "./image/profile1.jpg", time = "00:00 PM" }) {
    return (
        <>
            <div className="message receive position-relative d-flex align-items-end justify-content-end">
                <p className='mb-1'>{message}</p>
                <div className="profile ms-1"><img src={profile} alt="" /></div>
            </div>
                <p className='messageTime me-4 mb-0 text-end'>{time}</p>
        </>
    )
}

export default ReceiveMessage

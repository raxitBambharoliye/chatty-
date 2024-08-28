import React from 'react'

function SendMessage({ message, profile = `./image/dummyProfile.png`, time = "00:00 PM" }) {
  return (
    <>
      <div className="message receive position-relative d-flex align-items-end justify-content-end me-3">
        <p className='mb-1'>{message}</p>
        <div className="profile ms-1"><img src={profile} alt="" /></div>
      </div>
      <p className='messageTime me-4 mb-0 text-end'>{time}</p>
    </>
  )
}

export default SendMessage

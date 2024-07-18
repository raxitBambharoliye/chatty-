import React from 'react'

function SendMessage({message , profile=`./image/profile1.jpg` , time="00:00 PM"}) {
    return (
      <>
    <div className="message send position-relative d-flex align-items-end">
        <div className="profile me-1"><img src={profile} alt="" /></div>
          <p className='mb-1'>{message}</p>
    </div>
          <p className='messageTime ms-4 mb-0'>{time}</p>
</>
  )
}

export default SendMessage

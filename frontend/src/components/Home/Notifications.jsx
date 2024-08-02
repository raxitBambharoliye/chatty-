import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function Notifications() {
  const notification = useSelector((state) => state.chat.notification);
  const [userNotifications, setUserNotifications] = useState(null)
  useEffect(() => {
    if (notification && notification.length > 0) {
      setUserNotifications(notification)
    }
  }, [notification]);

  return (
    <div className='h-100 '>
      {(!userNotifications || userNotifications.length <= 0) &&
        <div className='h-100 d-flex flex-column justify-content-center align-items-center '>
          <h4 className='emptyMessage'>notification not found</h4>
        </div>}
      {(userNotifications && userNotifications.length > 0) && userNotifications.map((element, index) => (
        <div className="notificationItem d-flex align-items-center justify-content-around" key={index}>
          <div className="userProfile">
            <img src={element.userProfile??"./image/dummyProfile.png"} alt="" />
            </div>
            <div className="text">
            <h5>{element.userId.userName}</h5>
            <p className='mb-0'>{element.type=="FOLLOW_REQUEST" ?`sent you a friend request.` :""}</p>
          </div>
          <div className="acceptButton">
            <button className='btn btn-primary btn-sm'>Accept</button>
          </div>
        </div>
      ))
        }
    </div>
  )
}

export default Notifications

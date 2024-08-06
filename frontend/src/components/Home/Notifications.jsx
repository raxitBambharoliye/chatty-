import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {SocketContext} from '../../socket/SocketProvider'
import { EVENT_NAME } from '../../constant';
import { changeNotificationStatus } from '../../reducers/chatReducer';
function Notifications() {
  const notification = useSelector((state) => state.chat.notification);
  const [userNotifications, setUserNotifications] = useState(null)
  const { sendRequest } = useContext(SocketContext)
  const dispatch = useDispatch();
  useEffect(() => {
    if (notification && notification.length > 0) {
      setUserNotifications(notification)
    }
  }, [notification]);
  const acceptFriendRequest= (id,notificationId)=>{
    sendRequest({ eventName: EVENT_NAME.ACCEPT_FOLLOW_REQUEST, data: { friendId: id, notificationId } });
      dispatch(changeNotificationStatus({ id: notificationId, status: "FOLLOW_ACCEPTED" }));
  }
  return (
    <div className='h-100 '>
      {(!notification || notification.length <= 0) &&
        <div className='h-100 d-flex flex-column justify-content-center align-items-center '>
          <h4 className='emptyMessage'>notification not found</h4>
        </div>}
      {(notification && notification.length > 0) && notification.map((element, index) => (
        <div className="notificationItem d-flex align-items-center justify-content-around" key={`${index}NotificationItem`}>
          <div className="userProfile">
            {/* <img src={element.senderId.profilePicture?element.senderId.profilePicture:"./image/dummyProfile.png"} alt="" /> */}
            <img src={"./image/dummyProfile.png"} alt="" />
            </div>
            <div className="text">
            <h5>{element.senderId.userName}</h5>
            <p className='mb-0'>{element.type=="FOLLOW_REQUEST" ?`sent you a friend request.` :element.type=="FOLLOW_ACCEPTED"?`accepted your follow request`:''}</p>
          </div>
          {element.type=="FOLLOW_REQUEST"&&<div className="acceptButton">
            <button className='btn btn-primary btn-sm' onClick={(e)=>{acceptFriendRequest(element.senderId._id,element._id)}}> Accept</button>
          </div>
          }
          
        </div>
      ))
        }
    </div>
  )
}

export default Notifications

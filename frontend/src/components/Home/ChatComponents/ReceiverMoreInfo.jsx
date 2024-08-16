import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function ReceiverMoreInfo() {
  const activeChatInfo = useSelector((state) => state.chat.activeUserChat);
  const userInfo = useSelector((state) => state.userData.user);
  console.log('userInfo', userInfo)
  const [isGroup, setIsGroup] = useState(false);
  useEffect(() => {
    setIsGroup(activeChatInfo.type && activeChatInfo.type === 'GROUP');
  }, [activeChatInfo])
  return (
    <div className="receiverMorInfo">
      {/* info Header  */}
      <div className="infoHeader d-flex align-items-center w-100">
        <div className="userProfile me-2">
          <img src={isGroup ? activeChatInfo.groupProfile ?? "" : activeChatInfo.profilePicture ?? ""} alt="" />
        </div>
        <div className="userName">
          <h2 className='mb-1'>{isGroup ? activeChatInfo.groupName : activeChatInfo.userName}</h2>
          <p className='m-0'>{activeChatInfo.tagLine ?? "---"}</p>
        </div>
        <div className="actionButton flex-grow-1 text-end d-flex justify-content-end">
          <button className='btn favorite'><i className="fa-regular fa-star"></i></button>
          <button className='btn pin'><i className="fa-solid fa-thumbtack"></i></button>
          <button className='btn mute '><i className="fa-regular fa-bell"></i></button>
        </div>
      </div>
      <div className="infoBody">
        <div className="infoItem">
          <h3>100K</h3>
          <p>Followers</p>
        </div>
        {isGroup && <>
            <h5>Group Members ({activeChatInfo.groupMembers.length})</h5>
          <div className="groupMember">
            {activeChatInfo.groupMembers.map((element, index) => (
              <div className="groupMemberItem d-flex align-items-center justify-content-between">
                <div className="userInfo d-flex align-items-center">
                <div className="profileImage">
                  <img src={element.profilePicture??"./image/dummyProfile.png"} alt="" />
                </div>
                <p className='m-0'>{userInfo._id == element._id?"You":element.userName}</p>
               </div>
                <div className="itemButtons">

                {activeChatInfo.admin.includes(element._id)&& <p className='adminShow m-0 '>admin</p>}
                  {(!userInfo.friends.includes(element._id) && userInfo._id != element._id)&& <p className=' followShow m-0 '>{ userInfo.sendedRequest.includes(element._id)?"Requested":"Follow"}</p>}
                </div>
              </div>
            ))}
            {console.log(activeChatInfo)}
          </div>
        </>}
        <div className="buttons">
          <button className='btn informButton'><i className="fa-solid fa-user-minus"></i> un Follow </button>
          <button className='btn informButton'><i className="fa-solid fa-ban"></i>Block</button>
          <button className='btn informButton'><i className="fa-solid fa-thumbs-down"></i>Report</button>
        </div>

      </div>
    </div>
  )
}

export default ReceiverMoreInfo

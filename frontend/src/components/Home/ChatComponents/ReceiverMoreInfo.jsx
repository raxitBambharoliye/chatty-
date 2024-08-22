import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AddFriendsInGroup, EditAdmin } from '../../Models';
import { SocketContext } from '../../../socket/SocketProvider';
import eventName from '../../../constant/eventName';
import { EVENT_NAME } from '../../../constant';

function ReceiverMoreInfo() {
  const activeChatInfo = useSelector((state) => state.chat.activeUserChat);
  const userInfo = useSelector((state) => state.userData.user);
  const { sendRequest } = useContext(SocketContext);
  const [isGroup, setIsGroup] = useState(false);
  useEffect(() => {
    setIsGroup((activeChatInfo.type === 'GROUP'));
  }, [activeChatInfo])

  useEffect(() => {
    console.log("user.pinedUsers",userInfo.pinedUsers)
  },[userInfo])


  const leaveGroupHandler = () => {
    sendRequest({
      eventName: EVENT_NAME.LEAVE_GROUP,
      data: {
        groupId: activeChatInfo._id,
        userId:userInfo._id
      }
    })
  }
  const blockUser = () => {
    sendRequest({
      eventName: EVENT_NAME.BLOCK_USER,
      data: {
        isGroup:(activeChatInfo.type === 'GROUP'),
        blockUserId: activeChatInfo._id,
        userId: userInfo._id
      }
    })
  }
  const unBlockUser = () => {
    sendRequest({
      eventName: EVENT_NAME.UNBLOCK_USER,
      data: {
        isGroup:(activeChatInfo.type === 'GROUP'),
        blockUserId: activeChatInfo._id,
        userId: userInfo._id
      }
    })
  }
  const muteHandler= () =>{
    sendRequest({
      eventName:EVENT_NAME.MUTE_USER,
      data:{
        userId:userInfo._id,
        muteUserId:activeChatInfo._id,
        isGroup:(activeChatInfo.type === 'GROUP'),

      }
    })
  }
  const unMuteHandler= () =>{
    sendRequest({
      eventName:EVENT_NAME.UNMUTE_USER,
      data:{
        userId:userInfo._id,
        muteUserId:activeChatInfo._id,
        isGroup:(activeChatInfo.type === 'GROUP'),

      }
    })
  }
  const pinHandler= () =>{
    sendRequest({
      eventName:EVENT_NAME.PIN_USER,
      data:{
        userId:userInfo._id,
        pinUserId:activeChatInfo._id,
        isGroup:(activeChatInfo.type === 'GROUP'),

      }
    })
  }
  const unPinHandler= () =>{
    sendRequest({
      eventName:EVENT_NAME.UNPIN_USER,
      data:{
        userId:userInfo._id,
        pinUserId:activeChatInfo._id,
        isGroup:(activeChatInfo.type === 'GROUP'),

      }
    })
  }
  const SendFollowRequest = (id) => {
    let sendData = {
        eventName: EVENT_NAME.FOLLOW,
        data: {
            receiverId: id,
            senderId: userInfo._id
        }
    }
    sendRequest(sendData );
    console.log("send request ", id)
}

  return (
    <>
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
            {/* pin */}
            {
            console.log('userInfo.pinedUsers', userInfo.pinedUsers)
            }
            {userInfo.pinedUsers?.includes(activeChatInfo._id) &&<button className='btn favorite active' onClick={unPinHandler}><i className="fa-solid fa-star"></i></button> }
            {!userInfo.pinedUsers.includes(activeChatInfo._id) &&<button className='btn favorite' onClick={pinHandler}><i className="fa-regular fa-star"></i></button> }
            {/* mute  */}
            {userInfo.mutedUser.includes(activeChatInfo._id) && <button className='btn mute active' onClick={unMuteHandler}><i className="fa-regular fa-bell-slash"></i></button>}
            {!userInfo.mutedUser.includes(activeChatInfo._id) && <button className='btn mute ' onClick={muteHandler}><i className="fa-regular fa-bell"></i></button>}
            {/* add friends in group */}
            {(activeChatInfo.type === 'GROUP' && activeChatInfo.admin.includes(userInfo._id)) && <button className='btn addFriends' data-bs-toggle="modal" data-bs-target="#addFriendsInGroup"><i className="fa-solid fa-user-plus"></i></button>}
          </div>
        </div>
        <div className="infoBody">
          <div className="infoItem">
            <h3>100K</h3>
            <p>Followers</p>
          </div>
          {(activeChatInfo.type == 'GROUP') && <>
            <h5>Group Members ({activeChatInfo.groupMembers.length})</h5>
            <div className="groupMember">
              {activeChatInfo.groupMembers.map((element, index) => (
                <div className="groupMemberItem d-flex align-items-center justify-content-between" key={`GroupMember-${index}`}>
                  <div className="userInfo d-flex align-items-center">
                    <div className="profileImage">
                      <img src={element.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                    </div>
                    <p className='m-0'>{userInfo._id == element._id ? "You" : element.userName}</p>
                  </div>
                  <div className="itemButtons d-flex">
                    {activeChatInfo.admin.includes(element._id) && <p className='adminShow m-0 me-2'>admin</p>}
                    {(!userInfo.friends.includes(element._id) && userInfo._id != element._id && !userInfo.sendedRequest.includes(element._id) ) && <button className='btn followShow m-0 me-2' onClick={(e)=>{SendFollowRequest(element._id)}}>Follow</button>}
                    {(!userInfo.friends.includes(element._id) && userInfo._id != element._id && userInfo.sendedRequest.includes(element._id) ) && <button disabled className='btn followShow Requested  m-0 me-2'>Requested</button>}
                  </div>
                </div>
              ))}
            </div>
           {activeChatInfo.admin.includes(userInfo._id) &&  <div className="makeAdmin" data-bs-toggle="modal" data-bs-target="#editGroupAdmin">Edit group admins</div>}
          </>}
          <div className="buttons">
            {(activeChatInfo.type == 'GROUP') ? <button className='btn informButton' onClick={leaveGroupHandler}><i className="fa-solid fa-right-from-bracket"></i> Leave Group & delate Group</button> : <button className='btn informButton'><i className="fa-solid fa-user-minus"></i> un Follow </button>}
            {userInfo.blockedUserId.includes(activeChatInfo._id) ?
              <button className='btn informButton fill' onClick={unBlockUser}><i className="fa-solid fa-ban"></i>Un Block</button> :
              <button className='btn informButton' onClick={blockUser}><i className="fa-solid fa-ban"></i>Block</button>
}
            <button className='btn informButton' disabled><i className="fa-solid fa-thumbs-down"></i>Report</button>
          </div>
        </div>
      </div>
      {(activeChatInfo.type === "GROUP") &&<EditAdmin id={"editGroupAdmin"} modalClass='blackModal editGroupAdmin '/>}
      {(activeChatInfo.type === "GROUP") &&<AddFriendsInGroup id={"addFriendsInGroup"} modalClass='blackModal editGroupAdmin '/>}
    </>
  )
}

export default ReceiverMoreInfo

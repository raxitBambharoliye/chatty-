import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { AddFriendsInGroup, EditAdmin, EditGroup } from '../../Models';
import { SocketContext } from '../../../socket/SocketProvider';
import { EVENT_NAME } from '../../../constant';

function ReceiverMoreInfo({infoClassName='',closeInfo=()=>{}}) {
  const {activeUserChat,friends} = useSelector((state) => state.chat);
  const userInfo = useSelector((state) => state.userData.user);
  const {blockedUserId,mutedUser,pinedUsers,sendedRequest} = useSelector((state) => state.chat.userFriendsData);
  const { sendRequest } = useContext(SocketContext);
  const [isGroup, setIsGroup] = useState(false);
  useEffect(() => {
    setIsGroup((activeUserChat.type === 'GROUP'));
  }, [activeUserChat])

  


  const leaveGroupHandler = () => {
    sendRequest({
      eventName: EVENT_NAME.LEAVE_GROUP,
      data: {
        groupId: activeUserChat._id,
        userId: userInfo._id
      }
    })
  }
  const blockUser = () => {
    sendRequest({
      eventName: EVENT_NAME.BLOCK_USER,
      data: {
        isGroup: (activeUserChat.type === 'GROUP'),
        blockUserId: activeUserChat._id,
        userId: userInfo._id
      }
    })
  }
  const unBlockUser = () => {
    sendRequest({
      eventName: EVENT_NAME.UNBLOCK_USER,
      data: {
        isGroup: (activeUserChat.type === 'GROUP'),
        blockUserId: activeUserChat._id,
        userId: userInfo._id
      }
    })
  }
  const muteHandler = () => {
    sendRequest({
      eventName: EVENT_NAME.MUTE_USER,
      data: {
        userId: userInfo._id,
        muteUserId: activeUserChat._id,
        isGroup: (activeUserChat.type === 'GROUP'),

      }
    })
  }
  const unMuteHandler = () => {
    sendRequest({
      eventName: EVENT_NAME.UNMUTE_USER,
      data: {
        userId: userInfo._id,
        muteUserId: activeUserChat._id,
        isGroup: (activeUserChat.type === 'GROUP'),

      }
    })
  }
  const pinHandler = () => {
    sendRequest({
      eventName: EVENT_NAME.PIN_USER,
      data: {
        userId: userInfo._id,
        pinUserId: activeUserChat._id,
        isGroup: (activeUserChat.type === 'GROUP'),

      }
    })
  }
  const unPinHandler = () => {
    sendRequest({
      eventName: EVENT_NAME.UNPIN_USER,
      data: {
        userId: userInfo._id,
        pinUserId: activeUserChat._id,
        isGroup: (activeUserChat.type === 'GROUP'),

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
    sendRequest(sendData);
    console.log("send request ", id)
  }
  const unFollowHandler = () => {
    sendRequest({
      eventName: EVENT_NAME.UN_FOLLOW,
      data: {
        userId: userInfo._id,
        friendId:activeUserChat._id
      }
    })
  }
  return (
    <>
      <div className={`receiverMorInfo ${infoClassName} mt-4`} >
        {/* info Header  */}
        <div className="closeButton text-end ">
          <button className='btn' onClick={(e)=>{closeInfo(false)}}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="infoHeader d-flex align-items-center w-100">
          <div className="userProfile me-2">
            <img src={isGroup ? activeUserChat.groupProfile ?? "" : activeUserChat.profilePicture ?? ""} alt="" />
          </div>
          <div className="userName">
            <h2 className='mb-1'>{isGroup ? activeUserChat.groupName : activeUserChat.userName}</h2>
            <p className='m-0'>{activeUserChat.tagLine ?? "---"}</p>
          </div>
          <div className="actionButton flex-grow-1 text-end d-flex justify-content-end">
            {/* pin */}
            {pinedUsers?.includes(activeUserChat._id) && <button className='btn favorite active' onClick={unPinHandler}><i className="fa-solid fa-star"></i></button>}
            {!pinedUsers.includes(activeUserChat._id) && <button className='btn favorite' onClick={pinHandler}><i className="fa-regular fa-star"></i></button>}
            {/* mute  */}
            {mutedUser.includes(activeUserChat._id) && <button className='btn mute active' onClick={unMuteHandler}><i className="fa-regular fa-bell-slash"></i></button>}
            {!mutedUser.includes(activeUserChat._id) && <button className='btn mute ' onClick={muteHandler}><i className="fa-regular fa-bell"></i></button>}
            {/* add friends in group */}
            {(activeUserChat.type === 'GROUP' && activeUserChat.admin.includes(userInfo._id)) && <button className='btn addFriends' data-bs-toggle="modal" data-bs-target="#addFriendsInGroup" title='Add Friends '><i className="fa-solid fa-user-plus"></i></button>}
            {(activeUserChat.type === 'GROUP' && activeUserChat.admin.includes(userInfo._id)) && <button className='btn editGroup' data-bs-toggle="modal" data-bs-target="#editGroupData" title='edit Group'><i className="fa-solid fa-pen"></i></button>}

          </div>
        </div>
        <div className="infoBody">

          {(activeUserChat.type == 'GROUP') && <>
            <h5 className='mt-3'>Group Members ({activeUserChat.groupMembers.length})</h5>
            <div className="groupMember mb-2">
              {activeUserChat.groupMembers.map((element, index) => (
                <div className="groupMemberItem d-flex align-items-center justify-content-between" key={`GroupMember-${index}`}>
                  <div className="userInfo d-flex align-items-center">
                    <div className="profileImage">
                      <img src={element.profilePicture ?? "./image/dummyProfile.png"} alt="" />
                    </div>
                    <p className='m-0'>{userInfo._id == element._id ? "You" : element.userName}</p>
                  </div>
                  <div className="itemButtons d-flex">
                    {activeUserChat.admin.includes(element._id) && <p className='adminShow m-0 me-2'>admin</p>}
                    {((friends.findIndex((val)=> val._id == element._id)==-1) && userInfo._id != element._id && !sendedRequest.includes(element._id)) && <button className='btn followShow m-0 me-2' onClick={(e) => { SendFollowRequest(element._id) }}>Follow</button>}
                    {((friends.findIndex((val)=> val._id == element._id)==-1)&& userInfo._id != element._id && sendedRequest.includes(element._id)) && <button disabled className='btn followShow Requested  m-0 me-2'>Requested</button>}
                  </div>
                </div>
              ))}
            </div>
            {activeUserChat.admin.includes(userInfo._id) && <div className="makeAdmin" data-bs-toggle="modal" data-bs-target="#editGroupAdmin">Edit group admins</div>}
          </>}
          <div className="buttons mt-3">
            {(activeUserChat.type == 'GROUP') ?
              <button className='btn informButton' onClick={leaveGroupHandler}><i className="fa-solid fa-right-from-bracket"></i> Leave Group & delate Group</button> :
              <button button className='btn informButton' onClick={unFollowHandler}><i className="fa-solid fa-user-minus"></i> un Follow & delate Chat  </button> 
            }

            {(activeUserChat.type != 'GROUP') &&
              <>
                {blockedUserId.includes(activeUserChat._id) ?
                  <button className='btn informButton fill' onClick={unBlockUser}><i className="fa-solid fa-ban"></i>Un Block</button> :
                  <button className='btn informButton' onClick={blockUser}><i className="fa-solid fa-ban"></i>Block</button>
                }
              </>}
            <button className='btn informButton' disabled><i className="fa-solid fa-thumbs-down"></i>Report</button>
          </div>
        </div>
      </div >
      {(activeUserChat.type === "GROUP") && <EditAdmin id={"editGroupAdmin"} modalClass='blackModal editGroupAdmin ' />
      }
      {(activeUserChat.type === "GROUP") && <AddFriendsInGroup id={"addFriendsInGroup"} modalClass='blackModal editGroupAdmin ' />}
      {(activeUserChat.type === "GROUP") && <EditGroup id={"editGroupData"} modalClass=' secondBlackModal editUserProfile' />}
    </>
  )
}

export default ReceiverMoreInfo
